import express from 'express';
import { InventoryItem } from '../models/inventoryItem';

export const app = express();
app.use(express.json());

app.get('/inventory/:sku', (req, res) => {
  const { sku } = req.params;

  if (sku === 'SKU-100') {
    const responseBody: InventoryItem = {
      id: 'item-uuid-123',
      sku: 'SKU-100',
      quantity: 150,
      status: 'IN_STOCK',
    };
    return res.status(200).json(responseBody);
  }

  return res.status(404).json({ message: 'Item not found' });
});