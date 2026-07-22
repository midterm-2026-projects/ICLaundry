const Pagination = ({
  currentPage,
  totalPages,
  onPrevious,
  onNext,
}) => {
  return (
    <>
      <button
        onClick={onPrevious}
        disabled={currentPage === 1}
      >
        Previous
      </button>

      <span>
        Page {currentPage} of {totalPages}
      </span>

      <button
        onClick={onNext}
        disabled={
          currentPage === totalPages
        }
      >
        Next
      </button>
    </>
  );
};

export default Pagination;