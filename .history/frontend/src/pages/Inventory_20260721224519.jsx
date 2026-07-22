import { useEffect, useMemo, useState } from "react";

import AddItemButton from "../../components/AddItemButton";
import AddItemModal from "../../components/AddItemModal";
import EditItemModal from "../../components/EditItemModal";
import InventoryFilters from "../../components/InventoryFilters";
import InventoryTable from "../../components/InventoryTable";
import Pagination from "../../components/Pagination";
import RestockModal from "../../components/RestockModal";

/**
 * Temporary initial records for container and E2E workflow testing.
 *
 * Replace these with records from the Inventory API once the
 * backend integration is connected.
 */
const INITIAL_INVENTORY = [
  {
    id: 1,
    itemName: "Ariel Detergent",
    category: "Detergent",
    quantity: 25,
    unit: "pcs",
    minimumStock: 10,
    branch: "Main - Brgy 7",
  },
  {
    id: 2,
    itemName: "Downy Fabric Conditioner",
    category: "Fabric Conditioner",
    quantity: 8,
    unit: "L",
    minimumStock: 10,
    branch: "Main - Brgy 7",
  },
  {
    id: 3,
    itemName: "Bleach",
    category: "Chemical",
    quantity: 18,
    unit: "pcs",
    minimumStock: 5,
    branch: "2nd Branch - Brgy Calzada",
  },
  {
    id: 4,
    itemName: "Laundry Powder",
    category: "Detergent",
    quantity: 12,
    unit: "kg",
    minimumStock: 8,
    branch: "3rd Branch - Nasugbu",
  },
];

const ITEMS_PER_PAGE = 5;

const Inventory = () => {
  const [inventory, setInventory] = useState(INITIAL_INVENTORY);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedBranch, setSelectedBranch] = useState("All Branches");

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedItem, setSelectedItem] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);

  const [message, setMessage] = useState("");

  /**
   * Filter records using the search text and selected branch.
   */
  const filteredInventory = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return inventory.filter((item) => {
      const matchesSearch =
        !normalizedSearch ||
        item.itemName?.toLowerCase().includes(normalizedSearch) ||
        item.category?.toLowerCase().includes(normalizedSearch) ||
        item.unit?.toLowerCase().includes(normalizedSearch);

      const matchesBranch =
        selectedBranch === "All Branches" || item.branch === selectedBranch;

      return matchesSearch && matchesBranch;
    });
  }, [inventory, searchTerm, selectedBranch]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredInventory.length / ITEMS_PER_PAGE),
  );

  const paginatedInventory = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    return filteredInventory.slice(startIndex, startIndex + ITEMS_PER_PAGE);
  }, [filteredInventory, currentPage]);

  /**
   * Return to page one whenever the filters change.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBranch]);

  /**
   * Prevent the active page from becoming invalid after deletion.
   */
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /**
   * Lock page scrolling whenever a modal is open.
   */
  useEffect(() => {
    const hasOpenModal =
      isAddModalOpen || isEditModalOpen || isRestockModalOpen;

    if (!hasOpenModal) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [isAddModalOpen, isEditModalOpen, isRestockModalOpen]);

  /**
   * Close the active modal when Escape is pressed.
   */
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") {
        return;
      }

      closeAllModals();
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const clearMessage = () => {
    setMessage("");
  };

  const closeAllModals = () => {
    setIsAddModalOpen(false);
    setIsEditModalOpen(false);
    setIsRestockModalOpen(false);
    setSelectedItem(null);
  };

  const openAddModal = () => {
    clearMessage();
    setSelectedItem(null);
    setIsAddModalOpen(true);
  };

  const closeAddModal = () => {
    setIsAddModalOpen(false);
  };

  const openEditModal = (item) => {
    clearMessage();
    setSelectedItem(item);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setSelectedItem(null);
  };

  const openRestockModal = (item) => {
    clearMessage();
    setSelectedItem(item);
    setIsRestockModalOpen(true);
  };

  const closeRestockModal = () => {
    setIsRestockModalOpen(false);
    setSelectedItem(null);
  };

  /**
   * ADD ITEM WORKFLOW
   */
  const handleAddItem = (formData) => {
    const newItem = {
      id: Date.now(),

      itemName: formData.itemName.trim(),

      category: formData.category,

      quantity: Number(formData.quantity),

      unit: formData.unit,

      minimumStock: Number(formData.minimumStock),

      /**
       * When "All Branches" is active, assign the item
       * to the main branch by default.
       */
      branch:
        selectedBranch === "All Branches" ? "Main - Brgy 7" : selectedBranch,
    };

    setInventory((previous) => [newItem, ...previous]);

    setMessage(`${newItem.itemName} was added successfully.`);

    setCurrentPage(1);
    setIsAddModalOpen(false);
  };

  /**
   * EDIT ITEM WORKFLOW
   */
  const handleUpdateItem = (updatedData) => {
    if (!selectedItem) {
      return;
    }

    setInventory((previous) =>
      previous.map((item) => {
        if (item.id !== selectedItem.id) {
          return item;
        }

        return {
          ...item,

          itemName: updatedData.itemName.trim(),

          category: updatedData.category,

          quantity: Number(updatedData.quantity),

          unit: updatedData.unit,

          minimumStock: Number(updatedData.minimumStock),
        };
      }),
    );

    setMessage(`${updatedData.itemName} was updated successfully.`);

    closeEditModal();
  };

  /**
   * DELETE ITEM WORKFLOW
   */
  const handleDeleteItem = (item) => {
    const confirmed = window.confirm(
      `Delete "${item.itemName}" from inventory?`,
    );

    if (!confirmed) {
      return;
    }

    setInventory((previous) =>
      previous.filter((inventoryItem) => inventoryItem.id !== item.id),
    );

    setMessage(`${item.itemName} was deleted successfully.`);
  };

  /**
   * RESTOCK WORKFLOW
   */
  const handleSubmitRestock = ({ quantity, notes }) => {
    if (!selectedItem) {
      return;
    }

    const restockQuantity = Number(quantity);

    setInventory((previous) =>
      previous.map((item) => {
        if (item.id !== selectedItem.id) {
          return item;
        }

        return {
          ...item,

          quantity: Number(item.quantity) + restockQuantity,

          lastRestock: {
            quantity: restockQuantity,

            notes: notes?.trim() || "",

            date: new Date().toISOString(),
          },
        };
      }),
    );

    setMessage(
      `${selectedItem.itemName} was restocked by ${restockQuantity} ${selectedItem.unit}.`,
    );

    closeRestockModal();
  };

  const handlePreviousPage = () => {
    setCurrentPage((previous) => Math.max(previous - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage((previous) => Math.min(previous + 1, totalPages));
  };

  return (
    <main className="inventory-page">
      <section className="inventory-header">
        <div>
          <h1>Inventory</h1>

          <p>
            Manage laundry supplies, stock levels, and restocking transactions.
          </p>
        </div>

        <AddItemButton onAddItem={openAddModal} />
      </section>

      {message && (
        <div role="status" className="inventory-success-message">
          <span>{message}</span>

          <button
            type="button"
            onClick={clearMessage}
            aria-label="Close message"
          >
            ×
          </button>
        </div>
      )}

      <section className="inventory-filter-container">
        <InventoryFilters
          onSearchChange={setSearchTerm}
          onBranchChange={setSelectedBranch}
        />
      </section>

      <section className="inventory-content">
        <div className="inventory-result-summary">
          <span>
            Showing {paginatedInventory.length} of {filteredInventory.length}{" "}
            inventory records
          </span>

          <span>Branch: {selectedBranch}</span>
        </div>

        <div className="inventory-table-container">
          <InventoryTable
            inventory={paginatedInventory}
            onEdit={openEditModal}
            onDelete={handleDeleteItem}
            onRestock={openRestockModal}
          />
        </div>

        <div className="inventory-pagination">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPrevious={handlePreviousPage}
            onNext={handleNextPage}
          />
        </div>
      </section>

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={closeAddModal}
        onSaveItem={handleAddItem}
      />

      <EditItemModal
        isOpen={isEditModalOpen}
        item={selectedItem}
        onClose={closeEditModal}
        onUpdateItem={handleUpdateItem}
      />

      <RestockModal
        isOpen={isRestockModalOpen}
        item={selectedItem}
        onClose={closeRestockModal}
        onSubmitRestock={handleSubmitRestock}
      />
    </main>
  );
};

export default Inventory;
