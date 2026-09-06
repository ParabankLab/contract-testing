import { describe, it, expect } from '@jest/globals';
import { PactV3, MatchersV3 } from '@pact-foundation/pact';
import * as path from 'path';
import { InventoryClient } from '../clients/inventoryClient';

const { like, string, integer } = MatchersV3;

const provider = new PactV3({
  consumer: 'OrderService',
  provider: 'InventoryService',
  dir: path.resolve(process.cwd(), 'pacts'),
});

describe('InventoryClient Pact Test', () => {
  it('fetches inventory item details by SKU', () => {
    provider
      .given('item execution exists for SKU-100')
      .uponReceiving('a request to fetch stock levels')
      .withRequest({
        method: 'GET',
        path: '/inventory/SKU-100',
        headers: { Accept: 'application/json' },
      })
      .willRespondWith({
        status: 200,
        headers: { 'Content-Type': 'application/json' },
        body: like({
          id: string('item-uuid-123'),
          sku: string('SKU-100'),
          quantity: integer(150),
          status: string('IN_STOCK'),
        }),
      });

    return provider.executeTest(async (mockServer) => {
      const client = new InventoryClient(mockServer.url);
      const data = await client.getStock('SKU-100');

      expect(data.sku).toBe('SKU-100');
      expect(data.quantity).toBe(150);
      expect(data.status).toBe('IN_STOCK');
    });
  });
});