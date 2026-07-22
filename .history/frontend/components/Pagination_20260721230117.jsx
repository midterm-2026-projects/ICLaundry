import { ChevronLeft, ChevronRight } from "lucide-react";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPrevious,
  onNext,
}) => {
  return (
    <div className="inventory-pagination">
      <button
        type="button"
        className="inventory-pagination-button"
        onClick={onPrevious}
        disabled={currentPage <= 1}
        aria-label="Previous Page"
      >
        <ChevronLeft size={18} aria-hidden="true" />

        <span>Previous</span>
      </button>

      <div className="inventory-pagination-info">
        <span>
          Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
        </span>
      </div>

      <button
        type="button"
        className="inventory-pagination-button"
        onClick={onNext}
        disabled={currentPage >= totalPages}
        aria-label="Next Page"
      >
        <span>Next</span>

        <ChevronRight size={18} aria-hidden="true" />
      </button>
    </div>
  );
};

export default Pagination;
