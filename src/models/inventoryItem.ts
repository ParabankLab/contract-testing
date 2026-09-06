export interface InventoryItem {
  id: string;
  sku: string;
  quantity: number;
  status: 'IN_STOCK' | 'OUT_OF_STOCK' | 'DISCONTINUED';
}