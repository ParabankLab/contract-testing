import axios from 'axios';
import { InventoryItem } from '../models/inventoryItem';

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