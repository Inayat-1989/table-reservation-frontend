const MenuSelectionActions = ({
  onBack,
  onCancelDraft,
  onContinue,
  isSubmitting,
  isCancellingDraft,
  isLoadingMenu,
  menuError,
}) => {
  const isActionInProgress = isSubmitting || isCancellingDraft;

  return (
    <div className="d-flex flex-wrap justify-content-center gap-3 mt-5">
      <button
        type="button"
        className="btn btn-outline-secondary"
        onClick={onBack}
        disabled={isActionInProgress}
      >
        <i className="bi bi-arrow-left me-2" />
        Back
      </button>

      <button
        type="button"
        className="btn btn-outline-danger"
        onClick={onCancelDraft}
        disabled={isActionInProgress}
      >
        {isCancellingDraft ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" />
            Cancelling Draft...
          </>
        ) : (
          <>
            <i className="bi bi-x-circle me-2" />
            Cancel Draft
          </>
        )}
      </button>

      <button
        type="button"
        className="btn-get-started form-button"
        onClick={onContinue}
        disabled={isActionInProgress || isLoadingMenu || Boolean(menuError)}
      >
        {isSubmitting ? (
          <>
            <span className="spinner-border spinner-border-sm me-2" role="status" />
            Confirming Reservation...
          </>
        ) : (
          <>
            Continue
            <i className="bi bi-arrow-right ms-2" />
          </>
        )}
      </button>
    </div>
  );
};

export default MenuSelectionActions;
