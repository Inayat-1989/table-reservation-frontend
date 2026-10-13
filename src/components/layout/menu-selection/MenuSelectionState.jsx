const MenuSelectionState = ({
  isLoading,
  menuError,
  isSpecialMenuEligible,
  visibleItemCount,
  onRetry,
  isActionInProgress,
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-5" role="status">
        <span className="spinner-border text-danger" aria-hidden="true" />
        <p className="mt-3">Loading menu items...</p>
      </div>
    );
  }

  if (menuError) {
    return (
      <div className="alert alert-danger mt-4" role="alert">
        <p className="mb-2">{menuError}</p>

        <button
          type="button"
          className="btn btn-outline-danger"
          onClick={onRetry}
          disabled={isActionInProgress}
        >
          Try Again
        </button>
      </div>
    );
  }

  if (visibleItemCount === 0) {
    return (
      <div className="text-center py-5">
        <i className="bi bi-info-circle fs-3" aria-hidden="true" />

        <p className="mt-3">
          {!isSpecialMenuEligible
            ? "Special menu items are not available for this reservation."
            : "No special menu items are currently available."}
        </p>
      </div>
    );
  }

  return null;
};

export default MenuSelectionState;
