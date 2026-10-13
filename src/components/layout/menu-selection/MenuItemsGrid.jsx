import MenuItemCard from "./MenuItemCard";

const MenuItemsGrid = ({ items, selectedItems, disabled, onToggle }) => {
  const selectedIds = new Set(selectedItems.map((item) => item.id));

  return (
    <div className="row gy-4">
      {items.map((item) => (
        <MenuItemCard
          key={item.id}
          item={item}
          selected={selectedIds.has(item.id)}
          disabled={disabled}
          onToggle={onToggle}
        />
      ))}
    </div>
  );
};

export default MenuItemsGrid;
