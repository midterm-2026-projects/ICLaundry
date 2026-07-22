import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

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
  const [
    inventory,
    setInventory,
  ] = useState([]);

  const [
    searchTerm,
    setSearchTerm,
  ] = useState("");

  const [
    selectedBranch,
    setSelectedBranch,
  ] = useState("All Branches");

  const [
    currentPage,
    setCurrentPage,
  ] = useState(1);

  const [
    selectedItem,
    setSelectedItem,
  ] = useState(null);

  const [
    isAddModalOpen,
    setIsAddModalOpen,
  ] = useState(false);

  const [
    isEditModalOpen,
    setIsEditModalOpen,
  ] = useState(false);

  const [
    isRestockModalOpen,
    setIsRestockModalOpen,
  ] = useState(false);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    saving,
    setSaving,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  /**
   * Load inventory records from the backend.
   *
   * When selectedBranch is "All Branches":
   * GET /api/inventory
   *
   * When a specific branch is selected:
   * GET /api/inventory/branch/:branch
   */
  const loadInventory =
    useCallback(async () => {
      try {
        setLoading(true);
        setError("");

        const records =
          await fetchInventoryItems({
            branch:
              selectedBranch,
          });

        setInventory(
          Array.isArray(records)
            ? records
            : [],
        );
      } catch (
        requestError
      ) {
        const errorMessage =
          requestError
            ?.response
            ?.data
            ?.message ||
          requestError
            ?.message ||
          "Failed to load inventory records.";

        setError(
          errorMessage,
        );

        setInventory([]);
      } finally {
        setLoading(false);
      }
    }, [
      selectedBranch,
    ]);

  /**
   * Reload inventory whenever the selected branch changes.
   */
  useEffect(() => {
    loadInventory();
  }, [
    loadInventory,
  ]);

  /**
   * Apply frontend search filtering.
   *
   * Search covers:
   * - Item name
   * - Category
   * - Branch
   * - Unit
   */
  const filteredInventory =
    useMemo(() => {
      const normalizedSearch =
        searchTerm
          .trim()
          .toLowerCase();

      if (
        !normalizedSearch
      ) {
        return inventory;
      }

      return inventory.filter(
        (item) => {
          const searchableValues =
            [
              item.itemName,
              item.category,
              item.branch,
              item.unit,
            ];

          return searchableValues.some(
            (value) =>
              String(
                value ?? "",
              )
                .toLowerCase()
                .includes(
                  normalizedSearch,
                ),
          );
        },
      );
    }, [
      inventory,
      searchTerm,
    ]);

  /**
   * Calculate the number of pages.
   *
   * Math.max ensures that the pagination always displays
   * at least Page 1 of 1 when there are no records.
   */
  const totalPages =
    Math.max(
      1,
      Math.ceil(
        filteredInventory.length /
          ITEMS_PER_PAGE,
      ),
    );

  /**
   * Get only the records for the active page.
   */
  const paginatedInventory =
    useMemo(() => {
      const startIndex =
        (
          currentPage -
          1
        ) *
        ITEMS_PER_PAGE;

      const endIndex =
        startIndex +
        ITEMS_PER_PAGE;

      return filteredInventory.slice(
        startIndex,
        endIndex,
      );
    }, [
      currentPage,
      filteredInventory,
    ]);

  /**
   * Return to page one whenever search or branch filter changes.
   */
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    selectedBranch,
  ]);

  /**
   * Prevent the current page from becoming invalid
   * after deleting or filtering records.
   */
  useEffect(() => {
    if (
      currentPage >
      totalPages
    ) {
      setCurrentPage(
        totalPages,
      );
    }
  }, [
    currentPage,
    totalPages,
  ]);

  /**
   * Detect whether any inventory modal is currently open.
   */
  const hasOpenModal =
    isAddModalOpen ||
    isEditModalOpen ||
    isRestockModalOpen;

  /**
   * Lock page scrolling while a modal is open.
   */
  useEffect(() => {
    if (
      !hasOpenModal
    ) {
      return undefined;
    }

    const previousOverflow =
      document.body
        .style
        .overflow;

    document.body
      .style
      .overflow =
      "hidden";

    return () => {
      document.body
        .style
        .overflow =
        previousOverflow;
    };
  }, [
    hasOpenModal,
  ]);

  /**
   * Close all inventory modals.
   */
  const closeAllModals =
    useCallback(() => {
      if (saving) {
        return;
      }

      setIsAddModalOpen(
        false,
      );

      setIsEditModalOpen(
        false,
      );

      setIsRestockModalOpen(
        false,
      );

      setSelectedItem(
        null,
      );
    }, [
      saving,
    ]);

  /**
   * Close the active modal when Escape is pressed.
   */
  useEffect(() => {
    const handleEscape =
      (event) => {
        if (
          event.key ===
          "Escape"
        ) {
          closeAllModals();
        }
      };

    window.addEventListener(
      "keydown",
      handleEscape,
    );

    return () => {
      window.removeEventListener(
        "keydown",
        handleEscape,
      );
    };
  }, [
    closeAllModals,
  ]);