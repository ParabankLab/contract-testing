import axios from 'axios';

export interface InventoryItem {
  id: string;
  sku: string;
  quantity: number;
  status: string;
}

export class InventoryClient {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async getStock(sku: string): Promise<InventoryItem> {
    const response = await axios.get(`${this.baseUrl}/inventory/${sku}`, {
      headers: { Accept: 'application/json' },
    });
    return response.data;
  }
}