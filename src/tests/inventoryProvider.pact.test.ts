import { describe, it, beforeAll, afterAll } from '@jest/globals';
import { Verifier } from '@pact-foundation/pact';
import path from 'path';
import { Server } from 'http';
import { app } from '../provider/inventoryProvider';

describe('InventoryService Pact Provider Verification', () => {
  let server: Server;
  const PORT = 8081;

  beforeAll((done) => {
    server = app.listen(PORT, () => done());
  });

  afterAll((done) => {
    server.close(done);
  });

  it('validates expectations defined by OrderService contract', async () => {
    const verifier = new Verifier({
      provider: 'InventoryService',
      providerBaseUrl: `http://127.0.0.1:8080`,
      pactUrls: [
        path.resolve(process.cwd(), 'pacts/OrderService-InventoryService.json'),
      ],
      stateHandlers: {
        'item execution exists for SKU-100': async () => {
          // Return nothing (void) or a plain object to satisfy type checks
        },
      },
    });

    await verifier.verifyProvider();
  });
});