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
  const initialInventory = [
    {
      id: 1,
      name: "Ariel Powder",
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
  };
});

describe("Inventory Service", () => {
  beforeEach(() => {
    inventoryModel.resetInventory();

    vi.clearAllMocks();
  });

  describe("Create Inventory Item", () => {
    it("should create an inventory item with complete information", () => {
      const item = {
        name: "Surf Powder",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "packs",
        current_stock: 40,
        minimum_stock: 10,
        cost_per_unit: 18,
        usage_per_load: 0.45,
      };

      const result = createInventoryItem(item);

      const inventory = inventoryModel.getInventoryItems();

      expect(result).toBe("Inventory item created successfully");

      expect(inventory).toHaveLength(4);

      expect(inventory[3]).toMatchObject({
        id: 4,
        name: "Surf Powder",
      });
    });

    it("should not create an inventory item when the item name is missing", () => {
      const item = {
        name: "",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "packs",
        current_stock: 50,
      };

      const result = () => createInventoryItem(item);

      expect(result).toThrow(/Item name is required/i);

      expect(inventoryModel.insertInventoryItem).not.toHaveBeenCalled();
    });

    it("should not create an inventory item when the branch is missing", () => {
      const item = {
        name: "Ariel Powder",
        category_id: 1,
        branch: "",
        unit: "packs",
        current_stock: 50,
      };

      const result = () => createInventoryItem(item);

      expect(result).toThrow(/Branch is required/i);

      expect(inventoryModel.insertInventoryItem).not.toHaveBeenCalled();
    });

    it("should not create an inventory item when the unit is missing", () => {
      const item = {
        name: "Ariel Powder",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "",
        current_stock: 50,
      };

      const result = () => createInventoryItem(item);

      expect(result).toThrow(/Unit is required/i);

      expect(inventoryModel.insertInventoryItem).not.toHaveBeenCalled();
    });

    it("should not create an inventory item when current stock is negative", () => {
      const item = {
        name: "Ariel Powder",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "packs",
        current_stock: -10,
      };

      const result = () => createInventoryItem(item);

      expect(result).toThrow(/Current stock cannot be negative/i);

      expect(inventoryModel.insertInventoryItem).not.toHaveBeenCalled();
    });
  });

  describe("Read Inventory Items", () => {
    it("should retrieve all inventory records", () => {
      // Act
      const inventory = readInventoryItems();

      // Assert
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

    it("should retrieve an empty inventory list", () => {
      // Arrange
      inventoryModel.clearInventory();

      // Act
      const inventory = readInventoryItems();

      // Assert
      expect(inventory).toEqual([]);

      expect(inventory).toHaveLength(0);
    });
  });

  describe("Update Inventory Item", () => {
    it("should update an existing inventory item with complete information", () => {
      // Arrange
      const updatedItem = {
        name: "Updated Ariel Powder",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "packs",
        current_stock: 75,
        minimum_stock: 15,
        cost_per_unit: 18,
        usage_per_load: 0.6,
      };

      // Act
      const result = editInventoryItem(1, updatedItem);

      const inventory = inventoryModel.getInventoryItems();

      // Assert
      expect(result).toBe("Inventory item updated successfully");

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

    it("should not update an inventory item when the inventory ID is missing", () => {
      // Arrange
      const updatedItem = {
        name: "Updated Ariel Powder",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "packs",
        current_stock: 75,
      };

      // Act
      const result = () => editInventoryItem("", updatedItem);

      // Assert
      expect(result).toThrow(/Inventory ID is required/i);

      expect(inventoryModel.updateInventoryItem).not.toHaveBeenCalled();
    });

    it("should not update an inventory item when the item name is missing", () => {
      // Arrange
      const updatedItem = {
        name: "",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "packs",
        current_stock: 75,
      };

      // Act
      const result = () => editInventoryItem(1, updatedItem);

      // Assert
      expect(result).toThrow(/Item name is required/i);

      expect(inventoryModel.updateInventoryItem).not.toHaveBeenCalled();
    });

    it("should not update an inventory item when the branch is missing", () => {
      // Arrange
      const updatedItem = {
        name: "Ariel Powder",
        category_id: 1,
        branch: "",
        unit: "packs",
        current_stock: 75,
      };

      // Act
      const result = () => editInventoryItem(1, updatedItem);

      // Assert
      expect(result).toThrow(/Branch is required/i);

      expect(inventoryModel.updateInventoryItem).not.toHaveBeenCalled();
    });

    it("should not update an inventory item when the unit is missing", () => {
      // Arrange
      const updatedItem = {
        name: "Ariel Powder",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "",
        current_stock: 75,
      };

      // Act
      const result = () => editInventoryItem(1, updatedItem);

      // Assert
      expect(result).toThrow(/Unit is required/i);

      expect(inventoryModel.updateInventoryItem).not.toHaveBeenCalled();
    });

    it("should not update an inventory item when current stock is negative", () => {
      // Arrange
      const updatedItem = {
        name: "Ariel Powder",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "packs",
        current_stock: -1,
      };

      // Act
      const result = () => editInventoryItem(1, updatedItem);

      // Assert
      expect(result).toThrow(/Current stock cannot be negative/i);

      expect(inventoryModel.updateInventoryItem).not.toHaveBeenCalled();
    });

    it("should throw an error when updating an inventory item that does not exist", () => {
      // Arrange
      const updatedItem = {
        name: "Unknown Item",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "packs",
        current_stock: 10,
      };

      // Act
      const result = () => editInventoryItem(999, updatedItem);

      // Assert
      expect(result).toThrow(/Inventory item not found/i);
    });
  });

  describe("Delete Inventory Item", () => {
    it("should delete an existing inventory item", () => {
      // Act
      const result = removeInventoryItem(1);

      const inventory = inventoryModel.getInventoryItems();

      // Assert
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

    it("should not delete an inventory item when the inventory ID is missing", () => {
      // Act
      const result = () => removeInventoryItem("");

      // Assert
      expect(result).toThrow(/Inventory ID is required/i);

      expect(inventoryModel.deleteInventoryItem).not.toHaveBeenCalled();
    });

    it("should throw an error when deleting an inventory item that does not exist", () => {
      // Act
      const result = () => removeInventoryItem(999);

      // Assert
      expect(result).toThrow(/Inventory item not found/i);
    });
  });

  describe("Create Inventory Restock", () => {
    it("should create a new inventory restocking record", () => {
      // Arrange
      const inventoryRestock = {
        item_id: 1,
        quantity_added: 20,
      };

      // Act
      const result = createInventoryRestock(inventoryRestock);

      const inventoryRestocks = readInventoryRestocks();

      // Assert
      expect(result).toBe("Inventory restocked successfully");

      expect(inventoryRestocks).toHaveLength(2);

      expect(inventoryRestocks[1]).toEqual({
        id: 2,
        item_id: 1,
        quantity_added: 20,
      });
    });

    it("should automatically update the stock quantity after restocking", () => {
      // Arrange
      createInventoryRestock({
        item_id: 1,
        quantity_added: 10,
      });

      // Act
      const inventory = readInventoryItems();

      // Assert
      expect(inventory[0].current_stock).toBe(60);
    });

    it("should display the updated stock quantity after restocking", () => {
      // Arrange
      createInventoryRestock({
        item_id: 3,
        quantity_added: 5,
      });

      // Act
      const inventory = readInventoryItems();

      // Assert
      expect(inventory[2]).toMatchObject({
        id: 3,
        name: "Bleach",
        current_stock: 40,
        minimum_stock: 8,
      });
    });

    it("should not create a restock transaction when inventory item id is missing", () => {
      // Arrange
      const inventoryRestock = {
        item_id: "",
        quantity_added: 10,
      };

      // Act
      const result = () => createInventoryRestock(inventoryRestock);

      // Assert
      expect(result).toThrow(/Inventory Item ID is required/i);

      expect(inventoryModel.insertInventoryRestock).not.toHaveBeenCalled();
    });

    it("should not create a restock transaction when restock quantity is missing", () => {
      // Arrange
      const inventoryRestock = {
        item_id: 1,
        quantity_added: "",
      };

      // Act
      const result = () => createInventoryRestock(inventoryRestock);

      // Assert
      expect(result).toThrow(/Restock quantity is required/i);

      expect(inventoryModel.insertInventoryRestock).not.toHaveBeenCalled();
    });
  });

  describe("Read Inventory Restocks", () => {
    it("should retrieve all inventory restocking records", () => {
      // Act
      const inventoryRestocks = readInventoryRestocks();

      // Assert
      expect(inventoryRestocks).toHaveLength(1);

      expect(inventoryRestocks).toEqual([
        {
          id: 1,
          item_id: 1,
          quantity_added: 10,
        },
      ]);
    });

    it("should retrieve all inventory items with updated stock quantities", () => {
      // Arrange
      createInventoryRestock({
        item_id: 1,
        quantity_added: 5,
      });

      // Act
      const inventory = readInventoryItems();

      // Assert
      expect(inventory).toHaveLength(3);

      expect(inventory[0]).toMatchObject({
        id: 1,
        current_stock: 55,
      });
    });
  });

  describe("Stock Monitoring", () => {
    it("should display Low Stock status when stock reaches the minimum stock threshold", () => {
      // Arrange
      editInventoryItem(1, {
        ...readInventoryItems()[0],
        current_stock: 10,
      });

      // Act
      const status = checkStockStatus(1);

      // Assert
      expect(status).toBe("Low Stock");
    });

    it("should display Out of Stock status when stock quantity reaches zero", () => {
      // Arrange
      editInventoryItem(2, {
        ...readInventoryItems()[1],
        current_stock: 0,
      });

      // Act
      const status = checkStockStatus(2);

      // Assert
      expect(status).toBe("Out of Stock");
    });

    it("should display In Stock status when stock quantity is above the minimum stock threshold", () => {
      // Act
      const status = checkStockStatus(3);

      // Assert
      expect(status).toBe("In Stock");
    });

    it("should change Low Stock status to In Stock after restocking", () => {
      // Arrange
      editInventoryItem(1, {
        ...readInventoryItems()[0],
        current_stock: 10,
      });

      createInventoryRestock({
        item_id: 1,
        quantity_added: 20,
      });

      // Act
      const status = checkStockStatus(1);

      // Assert
      expect(status).toBe("In Stock");
    });

    it("should change Out of Stock status to In Stock after restocking", () => {
      // Arrange
      editInventoryItem(2, {
        ...readInventoryItems()[1],
        current_stock: 0,
      });

      createInventoryRestock({
        item_id: 2,
        quantity_added: 15,
      });

      // Act
      const status = checkStockStatus(2);

      // Assert
      expect(status).toBe("In Stock");
    });

    it("should throw an error when inventory item id is missing", () => {
      // Act
      const result = () => checkStockStatus("");

      // Assert
      expect(result).toThrow(/Inventory ID is required/i);
    });

    it("should throw an error when inventory item does not exist", () => {
      // Act
      const result = () => checkStockStatus(999);

      // Assert
      expect(result).toThrow(/Inventory item not found/i);
    });
  });
});
