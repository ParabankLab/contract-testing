import { app } from './inventoryProvider';

const PORT = process.env.PORT || 8081;

app.listen(PORT, () => {
  console.log(`InventoryService running on port ${PORT}`);
});