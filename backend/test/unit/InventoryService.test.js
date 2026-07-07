import { beforeEach, describe, expect, it, vi } from "vitest";

import * as inventoryModel from "../../models/InventoryModel.js";

import {
  createInventoryItem,
  readInventoryItems,
  editInventoryItem,
  removeInventoryItem,
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

  let inventory = [];

  const resetInventory = () => {
    inventory = structuredClone(initialInventory);
  };

  const clearInventory = () => {
    inventory = [];
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

      const index = inventory.findIndex(
        (item) => item.id === Number(id)
      );

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

      const index = inventory.findIndex(
        (item) => item.id === Number(id)
      );

      if (index === -1) {
        return false;
      }

      inventory.splice(index, 1);

      return true;

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

      // Arrange
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

      // Act
      const result = createInventoryItem(item);

      const inventory = inventoryModel.getInventoryItems();

      // Assert
      expect(result).toBe("Inventory item created successfully");

      expect(inventory).toHaveLength(4);

      expect(inventory[3]).toMatchObject({
        id: 4,
        name: "Surf Powder",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "packs",
        current_stock: 40,
        minimum_stock: 10,
        cost_per_unit: 18,
        usage_per_load: 0.45,
      });

    });

    it("should not create an inventory item when the item name is missing", () => {

      // Arrange
      const item = {
        name: "",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "packs",
        current_stock: 50,
      };

      // Act
      const result = () => createInventoryItem(item);

      // Assert
      expect(result).toThrow(/Item name is required/i);

      expect(inventoryModel.insertInventoryItem).not.toHaveBeenCalled();

    });

    it("should not create an inventory item when the branch is missing", () => {

      // Arrange
      const item = {
        name: "Ariel Powder",
        category_id: 1,
        branch: "",
        unit: "packs",
        current_stock: 50,
      };

      // Act
      const result = () => createInventoryItem(item);

      // Assert
      expect(result).toThrow(/Branch is required/i);

      expect(inventoryModel.insertInventoryItem).not.toHaveBeenCalled();

    });

    it("should not create an inventory item when the unit is missing", () => {

      // Arrange
      const item = {
        name: "Ariel Powder",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "",
        current_stock: 50,
      };

      // Act
      const result = () => createInventoryItem(item);

      // Assert
      expect(result).toThrow(/Unit is required/i);

      expect(inventoryModel.insertInventoryItem).not.toHaveBeenCalled();

    });

    it("should not create an inventory item when current stock is negative", () => {

      // Arrange
      const item = {
        name: "Ariel Powder",
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "packs",
        current_stock: -10,
      };

      // Act
      const result = () => createInventoryItem(item);

      // Assert
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

      expect(inventory[0].name).toBe("Ariel Powder");
      expect(inventory[1].name).toBe("Downy Fabric Conditioner");
      expect(inventory[2].name).toBe("Bleach");

    });

    it("should retrieve an empty inventory list", () => {

      // Arrange
      inventoryModel.clearInventory();

      // Act
      const inventory = readInventoryItems();

      // Assert
      expect(inventory).toEqual([]);

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
        usage_per_load: 0.60,
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
        category_id: 1,
        branch: "Main - Brgy 7",
        unit: "packs",
        current_stock: 75,
        minimum_stock: 15,
        cost_per_unit: 18,
        usage_per_load: 0.60,
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

});