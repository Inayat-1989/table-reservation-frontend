const MenuSelectionError = ({ message }) => {
  if (!message) {
    return null;
  }

  return (
    <div className="alert alert-danger mt-4" role="alert">
      <i className="bi bi-exclamation-circle me-2" />
      {message}
    </div>
  );
};

export default MenuSelectionError;
