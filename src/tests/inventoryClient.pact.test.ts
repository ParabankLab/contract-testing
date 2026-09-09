import { describe, it, expect } from '@jest/globals';
import { PactV3 } from '@pact-foundation/pact';
import fs from 'fs';
import path from 'path';
import { InventoryClient } from '../clients/inventoryClient';
import { InventoryMockFixtures } from '../models/pactExpectations';
import { allure } from 'jest-allure2-reporter/api';

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
        body: InventoryMockFixtures.getItemResponseBody(),
      });

    // 2. Attach generated Pact JSON file while the test context is active
    const pactFilePath = path.resolve(process.cwd(), 'pacts', 'OrderService-InventoryService.json');
    if (fs.existsSync(pactFilePath)) {
      const pactContent = fs.readFileSync(pactFilePath, 'utf-8');
      allure.attachment('Generated Pact Contract', pactContent, 'application/json');
    }


    return provider.executeTest(async (mockServer) => {
      const client = new InventoryClient(mockServer.url);
      const data = await client.getStock('SKU-100');

      expect(data.sku).toBe('SKU-100');
      expect(data.quantity).toBe(150);
      expect(data.status).toBe('IN_STOCK');
    });
  });

 
});