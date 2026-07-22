import { useCallback, useEffect, useMemo, useState } from "react";

import AddItemButton from "../../components/AddItemButton";
import AddItemModal from "../../components/AddItemModal";
import EditItemModal from "../../components/EditItemModal";
import InventoryFilters from "../../components/InventoryFilters";
import InventoryTable from "../../components/InventoryTable";
import Pagination from "../../components/Pagination";
import RestockModal from "../../components/RestockModal";

import {
  createInventoryItem,
  createInventoryRestock,
  deleteInventoryItem,
  fetchInventoryItems,
  updateInventoryItem,
} from "../API/inventoryAPI";

const ITEMS_PER_PAGE = 8;

const Inventory = () => {
  const [inventory, setInventory] = useState([]);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedBranch, setSelectedBranch] = useState("All Branches");

  const [currentPage, setCurrentPage] = useState(1);

  const [selectedItem, setSelectedItem] = useState(null);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const [isRestockModalOpen, setIsRestockModalOpen] = useState(false);

  const [loading, setLoading] = useState(true);

  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");

  const [message, setMessage] = useState("");

  /**
   * Load inventory records from the backend.
   *
   * When selectedBranch is "All Branches":
   * GET /api/inventory
   *
   * When a specific branch is selected:
   * GET /api/inventory/branch/:branch
   */
  const loadInventory = useCallback(async () => {
    try {
      setLoading(true);
      setError("");

      const records = await fetchInventoryItems({
        branch: selectedBranch,
      });

      setInventory(Array.isArray(records) ? records : []);
    } catch (requestError) {
      const errorMessage =
        requestError?.response?.data?.message ||
        requestError?.message ||
        "Failed to load inventory records.";

      setError(errorMessage);

      setInventory([]);
    } finally {
      setLoading(false);
    }
  }, [selectedBranch]);

  /**
   * Reload inventory whenever the selected branch changes.
   */
  useEffect(() => {
    loadInventory();
  }, [loadInventory]);

  /**
   * Apply frontend search filtering.
   *
   * Search covers:
   * - Item name
   * - Category
   * - Branch
   * - Unit
   */
  const filteredInventory = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    if (!normalizedSearch) {
      return inventory;
    }

    return inventory.filter((item) => {
      const searchableValues = [
        item.itemName,
        item.category,
        item.branch,
        item.unit,
      ];

      return searchableValues.some((value) =>
        String(value ?? "")
          .toLowerCase()
          .includes(normalizedSearch),
      );
    });
  }, [inventory, searchTerm]);

  /**
   * Calculate the number of pages.
   *
   * Math.max ensures that the pagination always displays
   * at least Page 1 of 1 when there are no records.
   */
  const totalPages = Math.max(
    1,
    Math.ceil(filteredInventory.length / ITEMS_PER_PAGE),
  );

  /**
   * Get only the records for the active page.
   */
  const paginatedInventory = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

    const endIndex = startIndex + ITEMS_PER_PAGE;

    return filteredInventory.slice(startIndex, endIndex);
  }, [currentPage, filteredInventory]);

  /**
   * Return to page one whenever search or branch filter changes.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm, selectedBranch]);

  /**
   * Prevent the current page from becoming invalid
   * after deleting or filtering records.
   */
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);

  /**
   * Detect whether any inventory modal is currently open.
   */
  const hasOpenModal = isAddModalOpen || isEditModalOpen || isRestockModalOpen;

  /**
   * Lock page scrolling while a modal is open.
   */
  useEffect(() => {
    if (!hasOpenModal) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [hasOpenModal]);

  /**
   * Close all inventory modals.
   */
  const closeAllModals = useCallback(() => {
    if (saving) {
      return;
    }

    setIsAddModalOpen(false);

    setIsEditModalOpen(false);

    setIsRestockModalOpen(false);

    setSelectedItem(null);
  }, [saving]);

  /**
   * Close the active modal when Escape is pressed.
   */
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === "Escape") {
        closeAllModals();
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("keydown", handleEscape);
    };
  }, [closeAllModals]);

  /**
   * Display success message.
   */
  const showSuccess = (successMessage) => {
    setError("");
    setMessage(successMessage);
  };

  /**
   * Open Add Item Modal.
   */
  const openAddModal = () => {
    setMessage("");
    setError("");
    setSelectedItem(null);

    setIsAddModalOpen(true);
  };

  /**
   * Open Edit Item Modal.
   */
  const openEditModal = (item) => {
    setMessage("");
    setError("");

    setSelectedItem(item);

    setIsEditModalOpen(true);
  };

  /**
   * Open Restock Modal.
   */
  const openRestockModal = (item) => {
    setMessage("");
    setError("");

    setSelectedItem(item);

    setIsRestockModalOpen(true);
  };

  /**
   * ===============================
   * ADD INVENTORY ITEM
   * ===============================
   */
  const handleAddItem = async (formData) => {
    try {
      setSaving(true);
      setError("");

      await createInventoryItem(formData);

      await loadInventory();

      setIsAddModalOpen(false);

      showSuccess(`${formData.itemName} was added successfully.`);
    } catch (requestError) {
      const requestMessage =
        requestError?.response?.data?.message ||
        requestError?.message ||
        "Failed to add inventory item.";

      setError(requestMessage);

      throw new Error(requestMessage);
    } finally {
      setSaving(false);
    }
  };

  /**
   * ===============================
   * UPDATE INVENTORY ITEM
   * ===============================
   */
  const handleUpdateItem = async (formData) => {
    if (!selectedItem?.id) {
      throw new Error(
        "Cannot update inventory item because its ID is missing.",
      );
    }

    try {
      setSaving(true);
      setError("");

      await updateInventoryItem(selectedItem.id, formData);

      await loadInventory();

      setIsEditModalOpen(false);

      setSelectedItem(null);

      showSuccess(`${formData.itemName} was updated successfully.`);
    } catch (requestError) {
      const requestMessage =
        requestError?.response?.data?.message ||
        requestError?.message ||
        "Failed to update inventory item.";

      setError(requestMessage);

      throw new Error(requestMessage);
    } finally {
      setSaving(false);
    }
  };

  /**
   * ===============================
   * DELETE INVENTORY ITEM
   * ===============================
   */
  const handleDeleteItem = async (item) => {
    if (!item?.id) {
      setError("Inventory ID is missing.");

      return;
    }

    const confirmed = window.confirm(
      `Delete "${item.itemName}" from inventory?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      await deleteInventoryItem(item.id);

      await loadInventory();

      showSuccess(`${item.itemName} was deleted successfully.`);
    } catch (requestError) {
      setError(
        requestError?.response?.data?.message ||
          requestError?.message ||
          "Failed to delete inventory item.",
      );
    } finally {
      setSaving(false);
    }
  };

  /**
   * ===============================
   * RESTOCK INVENTORY ITEM
   * ===============================
   */
  const handleRestock = async ({ quantity, notes }) => {
    if (!selectedItem?.id) {
      throw new Error("Inventory ID is missing.");
    }

    try {
      setSaving(true);
      setError("");

      await createInventoryRestock({
        itemId: selectedItem.id,

        quantity,

        notes,
      });

      await loadInventory();

      const itemName = selectedItem.itemName;

      setSelectedItem(null);

      setIsRestockModalOpen(false);

      showSuccess(`${itemName} was restocked successfully.`);
    } catch (requestError) {
      const requestMessage =
        requestError?.response?.data?.message ||
        requestError?.message ||
        "Failed to restock inventory item.";

      setError(requestMessage);

      throw new Error(requestMessage);
    } finally {
      setSaving(false);
    }
  };

  /**
   * ===============================
   * PAGINATION
   * ===============================
   */
  const goToPreviousPage = () => {
    setCurrentPage((previousPage) => Math.max(1, previousPage - 1));
  };

  const goToNextPage = () => {
    setCurrentPage((previousPage) => Math.min(totalPages, previousPage + 1));
  };
  return (
    <main className="inventory-page">
      <div className="inventory-shell">
      <section className="inventory-page-header">
        <div>
          <h1>Inventory</h1>

          <p>
            Manage inventory items, branch stock, and restocking transactions.
          </p>
        </div>

        <AddItemButton onAddItem={openAddModal} disabled={saving} />
      </section>

      {message && (
        <div role="status" className="inventory-message">
          <span>{message}</span>

          <button
            type="button"
            aria-label="Close success message"
            onClick={() => setMessage("")}
          >
            ×
          </button>
        </div>
      )}

      {error && (
        <div role="alert" className="inventory-error">
          {error}
        </div>
      )}

      <section className="inventory-toolbar">
        <InventoryFilters
          searchTerm={searchTerm}
          selectedBranch={selectedBranch}
          onSearchChange={setSearchTerm}
          onBranchChange={setSelectedBranch}
        />
      </section>

      <section className="inventory-card">
        <div className="inventory-summary">
          <span>
            {filteredInventory.length} record
            {filteredInventory.length === 1 ? "" : "s"}
          </span>

          <span>{selectedBranch}</span>
        </div>

        {loading ? (
          <div className="inventory-loading">Loading inventory...</div>
        ) : (
          <div className="inventory-table-wrapper">
            <InventoryTable
              inventory={paginatedInventory}
              onEdit={openEditModal}
              onDelete={handleDeleteItem}
              onRestock={openRestockModal}
              disabled={saving}
            />
          </div>
        )}

        {!loading && (
          <div className="inventory-pagination">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPrevious={goToPreviousPage}
              onNext={goToNextPage}
            />
          </div>
        )}
      </section>

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={closeAllModals}
        onSaveItem={handleAddItem}
        isSubmitting={saving}
      />

      <EditItemModal
        isOpen={isEditModalOpen}
        item={selectedItem}
        onClose={closeAllModals}
        onUpdateItem={handleUpdateItem}
        isSubmitting={saving}
      />

      <RestockModal
        isOpen={isRestockModalOpen}
        item={selectedItem}
        onClose={closeAllModals}
        onSubmitRestock={handleRestock}
        isSubmitting={saving}
      />
      </div>
    </main>
  );
};

export default Inventory;
