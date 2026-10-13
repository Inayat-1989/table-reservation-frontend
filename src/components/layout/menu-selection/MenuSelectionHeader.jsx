const MenuSelectionHeader = ({ booking }) => {
  return (
    <>
      <div className="section-title">
        <h2>Select Your Menu</h2>
        <p>
          <span>Choose</span>{" "}
          <span className="description-title">Your Food</span>
        </p>
      </div>

      {booking && (
        <div className="mb-4">
          <p className="text-center mb-0">
            Select the special menu items you would like to add to your
            reservation.
          </p>
        </div>
      )}
    </>
  );
};

export default MenuSelectionHeader;
