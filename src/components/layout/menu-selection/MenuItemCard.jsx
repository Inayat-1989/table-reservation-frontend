const MenuItemCard = ({ item, selected, disabled, onToggle }) => {
  const handleKeyDown = (event) => {
    if (disabled || (event.key !== 'Enter' && event.key !== ' ')) {
      return;
    }

    event.preventDefault();
    onToggle(item);
  };

  const formatPrice = (price) => {
    if (price == null || price === '') {
      return '';
    }

    const numericPrice = Number(price);

    if (!Number.isFinite(numericPrice)) {
      return price;
    }

    return `$. ${numericPrice.toLocaleString('en-US')}`;
  };

  return (
    <div className="col-lg-4 col-md-6" key={item.id}>
      <div
        className={`menu-selection-item h-100 ${
          item.isSpecial ? 'special-item' : ''
        } ${selected ? 'selected' : ''}`}
        onClick={() => {
          if (!disabled) {
            onToggle(item);
          }
        }}
        onKeyDown={handleKeyDown}
        role="button"
        aria-pressed={selected}
        aria-disabled={disabled}
        aria-label={`${item.title}, ${selected ? 'selected' : 'not selected'}`}
        tabIndex={disabled ? -1 : 0}
      >
        <div className="menu-selection-image position-relative">
          {item.src ? (
            <img src={item.src} className="menu-selection-image" alt={item.title} loading="lazy" />
          ) : (
            <div className="text-center p-5">Image unavailable</div>
          )}

          <span className="menu-special-badge">
            <i className="bi bi-star-fill me-1" />
            Special
          </span>

          {selected && (
            <div className="menu-selected-indicator">
              <i className="bi bi-check-lg" />
            </div>
          )}
        </div>

        <div className="menu-selection-content">
          <div className="d-flex justify-content-between align-items-start gap-3">
            <div>
              <h4>{item.title}</h4>

              <span className="menu-special-label">
                <i className="bi bi-star-fill me-1" />
                Special
              </span>
            </div>

            <span className="menu-price">{formatPrice(item.price)}</span>
          </div>

          <p>{item.description}</p>

          <div className="menu-selection-status">
            {selected ? (
              <>
                <i className="bi bi-check-circle-fill me-1" />
                Selected
              </>
            ) : (
              <>
                <i className="bi bi-plus-circle me-1" />
                Select
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MenuItemCard;
