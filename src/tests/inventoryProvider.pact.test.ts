import { Verifier } from '@pact-foundation/pact';
import path from 'path';
import express from 'express';
import { Server } from 'http';

describe('InventoryService Pact Provider Verification', () => {
  let server: Server;
  const PORT = 3001; // Avoid 8080 (Jenkins)

  beforeAll((done) => {
    const app = express();
    app.use(express.json());

    // Mock Provider Endpoint matching the contract definition
    app.get('/inventory/:sku', (req, res) => {
      res.setHeader('Content-Type', 'application/json');
      res.status(200).json({
        id: 'item-uuid-123',
        quantity: 150,
        sku: req.params.sku,
        status: 'IN_STOCK',
      });
    });

    server = app.listen(PORT, () => done());
  });

  afterAll((done) => {
    if (server) {
      server.close(done);
    } else {
      done();
    }
  });

  it('validates expectations defined by OrderService contract', async () => {
    const opts = {
      provider: 'InventoryService',
      providerBaseUrl: `http://127.0.0.1:${PORT}`,
      
      // Load contract strictly from local file
      pactUrls: [
        path.resolve(process.cwd(), 'pacts', 'OrderService-InventoryService.json'),
      ],
      
      // Ensure no broker options are present:
      // DO NOT include pactBrokerUrl or consumerVersionSelectors
    };

    return new Verifier(opts).verifyProvider();
  });
});