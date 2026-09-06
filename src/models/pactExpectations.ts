import { MatchersV3 } from '@pact-foundation/pact';

const { like, string, integer } = MatchersV3;

export const InventoryMockFixtures = {
  defaultItem: {
    id: string('item-uuid-123'),
    sku: string('SKU-100'),
    quantity: integer(150),
    status: string('IN_STOCK'),
  },

  getItemResponseBody: () => like(InventoryMockFixtures.defaultItem),
};