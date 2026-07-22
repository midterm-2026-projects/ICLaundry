import { beforeEach, describe, expect, it, vi } from "vitest";

import * as inventoryModel from "../../models/InventoryModel.js";

import {
  createInventoryItem,
  readInventoryItems,
  editInventoryItem,
  removeInventoryItem,
  createInventoryRestock,
  readInventoryRestocks,
  checkStockStatus,
} from "../../services/InventoryService.js";

vi.mock("../../models/InventoryModel.js", () => {
  const categories = [
    { id: 1, name: "Detergent" },
    { id: 2, name: "Fabric Care" },
    { id: 3, name: "Chemicals" },
  ];

  const initialInventory = [
    {
      id: 1,
      name: "Ariel Powder",
      category: "Detergent",
      category_id: 1,
      branch: "Main - Brgy 7",
      unit: "packs",
      current_stock: 50,
      minimum_stock: 10,
      cost_per_unit: 15,
      usage_per_load: 0.5,
    },
    {
      id: 2,
      name: "Downy Fabric Conditioner",
      category: "Fabric Care",
      category_id: 2,
      branch: "Main - Brgy 7",
      unit: "bottles",
      current_stock: 20,
      minimum_stock: 5,
      cost_per_unit: 120,
      usage_per_load: 0.25,
    },
    {
      id: 3,
      name: "Bleach",
      category: "Chemicals",
      category_id: 3,
      branch: "2nd Branch - Brgy Calzada",
      unit: "Liters",
      current_stock: 35,
      minimum_stock: 8,
      cost_per_unit: 85,
      usage_per_load: 0.15,
    },
  ];

  const initialInventoryRestocks = [
    {
      id: 1,
      item_id: 1,
      quantity_added: 10,
    },
  ];

  let inventory = [];
  let inventoryRestocks = [];

  const resetInventory = () => {
    inventory = structuredClone(initialInventory);

    inventoryRestocks = structuredClone(initialInventoryRestocks);
  };

  const clearInventory = () => {
    inventory = [];
    inventoryRestocks = [];
  };

  resetInventory();

  return {
    resetInventory,
    clearInventory,

    insertInventoryItem: vi.fn((item) => {
      const newItem = {
        id: inventory.length + 1,
        ...item,
      };

      inventory.push(newItem);

      return newItem;
    }),

    getInventoryItems: vi.fn(() => inventory),

    getInventoryItemById: vi.fn((id) => {
      return inventory.find((item) => item.id === Number(id)) || null;
    }),

    getInventoryItemsByBranch: vi.fn((branch) => {
      return inventory.filter((item) => item.branch === branch);
    }),

    getInventoryCategoryByName: vi.fn((name) => {
      return categories.find((c) => c.name === name) || null;
    }),

    updateInventoryItem: vi.fn((id, updatedItem) => {
      const index = inventory.findIndex((item) => item.id === Number(id));

      if (index === -1) {
        return null;
      }

      inventory[index] = {
        ...inventory[index],
        ...updatedItem,
      };

      return inventory[index];
    }),

    deleteInventoryItem: vi.fn((id) => {
      const index = inventory.findIndex((item) => item.id === Number(id));

      if (index === -1) {
        return false;
      }

      inventory.splice(index, 1);

      return true;
    }),

    insertInventoryRestock: vi.fn((inventoryRestock) => {
      const newRestock = {
        id: inventoryRestocks.length + 1,
        ...inventoryRestock,
      };

      inventoryRestocks.push(newRestock);

      return newRestock;
    }),

    getInventoryRestocks: vi.fn(() => inventoryRestocks),

    updateInventoryStock: vi.fn((itemId, quantityAdded) => {
      const index = inventory.findIndex((item) => item.id === Number(itemId));

      if (index === -1) {
        return null;
      }

      inventory[index] = {
        ...inventory[index],
        current_stock:
          Number(inventory[index].current_stock) + Number(quantityAdded),
      };

      return inventory[index];
    }),

    insertInventoryUsageLog: vi.fn((log) => {
      return { id: 1, ...log };
    }),

    getInventoryUsageLogs: vi.fn(() => []),
  };
});

describe("Inventory Service", () => {
  beforeEach(() => {
    inventoryModel.resetInventory();

    vi.clearAllMocks();
  });

  describe("Create Inventory Item", () => {
    it("should create an inventory item with complete information", async () => {
      const item = {
        name: "Surf Powder",
        category: "Detergent",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "packs",
        current_stock: 40,
        minimum_stock: 10,
        cost_per_unit: 18,
        usage_per_load: 0.45,
      };

      const result = await createInventoryItem(item);

      const inventory = inventoryModel.getInventoryItems();

      expect(result).toMatchObject({
        id: 4,
        name: "Surf Powder",
      });

      expect(inventory).toHaveLength(4);

      expect(inventory[3]).toMatchObject({
        id: 4,
        name: "Surf Powder",
      });
    });

    it("should not create an inventory item when the item name is missing", async () => {
      const item = {
        name: "",
        category: "Detergent",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "packs",
        current_stock: 50,
      };

      await expect(createInventoryItem(item)).rejects.toThrow(
        /Item name is required/i,
      );

      expect(inventoryModel.insertInventoryItem).not.toHaveBeenCalled();
    });

    it("should not create an inventory item when the branch is missing", async () => {
      const item = {
        name: "Ariel Powder",
        category: "Detergent",
        category_id: 1,
        branch: "",
        unit: "packs",
        current_stock: 50,
      };

      await expect(createInventoryItem(item)).rejects.toThrow(
        /Branch is required/i,
      );

      expect(inventoryModel.insertInventoryItem).not.toHaveBeenCalled();
    });

    it("should not create an inventory item when the unit is missing", async () => {
      const item = {
        name: "Ariel Powder",
        category: "Detergent",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "",
        current_stock: 50,
      };

      await expect(createInventoryItem(item)).rejects.toThrow(
        /Unit is required/i,
      );

      expect(inventoryModel.insertInventoryItem).not.toHaveBeenCalled();
    });

    it("should not create an inventory item when current stock is negative", async () => {
      const item = {
        name: "Ariel Powder",
        category: "Detergent",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "packs",
        current_stock: -10,
      };

      await expect(createInventoryItem(item)).rejects.toThrow(
        /Current stock cannot be negative/i,
      );

      expect(inventoryModel.insertInventoryItem).not.toHaveBeenCalled();
    });
  });

  describe("Read Inventory Items", () => {
    it("should retrieve all inventory records", async () => {
      const inventory = await readInventoryItems();

      expect(inventory).toHaveLength(3);

      expect(inventory[0]).toMatchObject({
        id: 1,
        name: "Ariel Powder",
      });

      expect(inventory[1]).toMatchObject({
        id: 2,
        name: "Downy Fabric Conditioner",
      });

      expect(inventory[2]).toMatchObject({
        id: 3,
        name: "Bleach",
      });
    });

    it("should retrieve an empty inventory list", async () => {
      inventoryModel.clearInventory();

      const inventory = await readInventoryItems();

      expect(inventory).toEqual([]);

      expect(inventory).toHaveLength(0);
    });
  });

  describe("Update Inventory Item", () => {
    it("should update an existing inventory item with complete information", async () => {
      const updatedItem = {
        name: "Updated Ariel Powder",
        category: "Detergent",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "packs",
        current_stock: 75,
        minimum_stock: 15,
        cost_per_unit: 18,
        usage_per_load: 0.6,
      };

      const result = await editInventoryItem(1, updatedItem);

      const inventory = await readInventoryItems();

      expect(result).toMatchObject({
        id: 1,
        name: "Updated Ariel Powder",
        current_stock: 75,
        minimum_stock: 15,
        cost_per_unit: 18,
        usage_per_load: 0.6,
      });

      expect(inventory).toHaveLength(3);

      expect(inventory[0]).toMatchObject({
        id: 1,
        name: "Updated Ariel Powder",
        current_stock: 75,
        minimum_stock: 15,
        cost_per_unit: 18,
        usage_per_load: 0.6,
      });
    });

    it("should not update an inventory item when the inventory ID is missing", async () => {
      const updatedItem = {
        name: "Updated Ariel Powder",
        category: "Detergent",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "packs",
        current_stock: 75,
      };

      await expect(editInventoryItem("", updatedItem)).rejects.toThrow(
        /Inventory ID is required/i,
      );

      expect(inventoryModel.updateInventoryItem).not.toHaveBeenCalled();
    });

    it("should not update an inventory item when the item name is missing", async () => {
      const updatedItem = {
        name: "",
        category: "Detergent",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "packs",
        current_stock: 75,
      };

      await expect(editInventoryItem(1, updatedItem)).rejects.toThrow(
        /Item name is required/i,
      );

      expect(inventoryModel.updateInventoryItem).not.toHaveBeenCalled();
    });

    it("should not update an inventory item when the branch is missing", async () => {
      const updatedItem = {
        name: "Ariel Powder",
        category: "Detergent",
        category_id: 1,
        branch: "",
        unit: "packs",
        current_stock: 75,
      };

      await expect(editInventoryItem(1, updatedItem)).rejects.toThrow(
        /Branch is required/i,
      );

      expect(inventoryModel.updateInventoryItem).not.toHaveBeenCalled();
    });

    it("should not update an inventory item when the unit is missing", async () => {
      const updatedItem = {
        name: "Ariel Powder",
        category: "Detergent",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "",
        current_stock: 75,
      };

      await expect(editInventoryItem(1, updatedItem)).rejects.toThrow(
        /Unit is required/i,
      );

      expect(inventoryModel.updateInventoryItem).not.toHaveBeenCalled();
    });

    it("should not update an inventory item when current stock is negative", async () => {
      const updatedItem = {
        name: "Ariel Powder",
        category: "Detergent",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "packs",
        current_stock: -1,
      };

      await expect(editInventoryItem(1, updatedItem)).rejects.toThrow(
        /Current stock cannot be negative/i,
      );

      expect(inventoryModel.updateInventoryItem).not.toHaveBeenCalled();
    });

    it("should throw an error when updating an inventory item that does not exist", async () => {
      const updatedItem = {
        name: "Unknown Item",
        category: "Detergent",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "packs",
        current_stock: 10,
      };

      await expect(editInventoryItem(999, updatedItem)).rejects.toThrow(
        /Inventory item not found/i,
      );
    });
  });

  describe("Delete Inventory Item", () => {
    it("should delete an existing inventory item", async () => {
      const result = await removeInventoryItem(1);

      const inventory = await readInventoryItems();

      expect(result).toBe("Inventory item deleted successfully");

      expect(inventory).toHaveLength(2);

      expect(inventory[0]).toMatchObject({
        id: 2,
        name: "Downy Fabric Conditioner",
      });

      expect(inventory[1]).toMatchObject({
        id: 3,
        name: "Bleach",
      });
    });

    it("should not delete an inventory item when the inventory ID is missing", async () => {
      await expect(removeInventoryItem("")).rejects.toThrow(
        /Inventory ID is required/i,
      );

      expect(inventoryModel.deleteInventoryItem).not.toHaveBeenCalled();
    });

    it("should throw an error when deleting an inventory item that does not exist", async () => {
      await expect(removeInventoryItem(999)).rejects.toThrow(
        /Inventory item not found/i,
      );
    });
  });

  describe("Create Inventory Restock", () => {
    it("should create a new inventory restocking record", async () => {
      const inventoryRestock = {
        item_id: 1,
        quantity_added: 20,
      };

      const result = await createInventoryRestock(inventoryRestock);

      const inventoryRestocks = await readInventoryRestocks();

      expect(result).toMatchObject({
        id: 2,
        item_id: 1,
        quantity_added: 20,
      });

      expect(inventoryRestocks).toHaveLength(2);

      expect(inventoryRestocks[1]).toEqual({
        id: 2,
        item_id: 1,
        quantity_added: 20,
      });
    });

    it("should automatically update the stock quantity after restocking", async () => {
      await createInventoryRestock({
        item_id: 1,
        quantity_added: 10,
      });

      const inventory = await readInventoryItems();

      expect(inventory[0].current_stock).toBe(60);
    });

    it("should display the updated stock quantity after restocking", async () => {
      await createInventoryRestock({
        item_id: 3,
        quantity_added: 5,
      });

      const inventory = await readInventoryItems();

      expect(inventory[2]).toMatchObject({
        id: 3,
        name: "Bleach",
        current_stock: 40,
        minimum_stock: 8,
      });
    });

    it("should not create a restock transaction when inventory item id is missing", async () => {
      const inventoryRestock = {
        item_id: "",
        quantity_added: 10,
      };

      await expect(createInventoryRestock(inventoryRestock)).rejects.toThrow(
        /Inventory Item ID is required/i,
      );

      expect(inventoryModel.insertInventoryRestock).not.toHaveBeenCalled();
    });

    it("should not create a restock transaction when restock quantity is missing", async () => {
      const inventoryRestock = {
        item_id: 1,
        quantity_added: "",
      };

      await expect(createInventoryRestock(inventoryRestock)).rejects.toThrow(
        /Restock quantity is required/i,
      );

      expect(inventoryModel.insertInventoryRestock).not.toHaveBeenCalled();
    });
  });

  describe("Read Inventory Restocks", () => {
    it("should retrieve all inventory restocking records", async () => {
      const inventoryRestocks = await readInventoryRestocks();

      expect(inventoryRestocks).toHaveLength(1);

      expect(inventoryRestocks).toEqual([
        {
          id: 1,
          item_id: 1,
          quantity_added: 10,
        },
      ]);
    });

    it("should retrieve all inventory items with updated stock quantities", async () => {
      await createInventoryRestock({
        item_id: 1,
        quantity_added: 5,
      });

      const inventory = await readInventoryItems();

      expect(inventory).toHaveLength(3);

      expect(inventory[0]).toMatchObject({
        id: 1,
        current_stock: 55,
      });
    });
  });

  describe("Stock Monitoring", () => {
    it("should display Low Stock status when stock reaches the minimum stock threshold", async () => {
      const items = inventoryModel.getInventoryItems();

      await editInventoryItem(1, {
        ...items[0],
        current_stock: 10,
      });

      const status = await checkStockStatus(1);

      expect(status).toBe("Low Stock");
    });

    it("should display Out of Stock status when stock quantity reaches zero", async () => {
      const items = inventoryModel.getInventoryItems();

      await editInventoryItem(2, {
        ...items[1],
        current_stock: 0,
      });

      const status = await checkStockStatus(2);

      expect(status).toBe("Out of Stock");
    });

    it("should display In Stock status when stock quantity is above the minimum stock threshold", async () => {
      const status = await checkStockStatus(3);

      expect(status).toBe("In Stock");
    });

    it("should change Low Stock status to In Stock after restocking", async () => {
      const items = inventoryModel.getInventoryItems();

      await editInventoryItem(1, {
        ...items[0],
        current_stock: 10,
      });

      await createInventoryRestock({
        item_id: 1,
        quantity_added: 20,
      });

      const status = await checkStockStatus(1);

      expect(status).toBe("In Stock");
    });

    it("should change Out of Stock status to In Stock after restocking", async () => {
      const items = inventoryModel.getInventoryItems();

      await editInventoryItem(2, {
        ...items[1],
        current_stock: 0,
      });

      await createInventoryRestock({
        item_id: 2,
        quantity_added: 15,
      });

      const status = await checkStockStatus(2);

      expect(status).toBe("In Stock");
    });

    it("should throw an error when inventory item id is missing", async () => {
      await expect(checkStockStatus("")).rejects.toThrow(
        /Inventory ID is required/i,
      );
    });

    it("should throw an error when inventory item does not exist", async () => {
      await expect(checkStockStatus(999)).rejects.toThrow(
        /Inventory item not found/i,
      );
    });
  });
});
