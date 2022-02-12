import React from "react";
//import component
import ItemFilter from "./ItemFilter";
const ItemList = ({ filteredItems, itemList, setItemList }) => {
  return (
    <div className="todo-container">
      <ul className="todo-list">
        {filteredItems.map((item) => (
          <ItemFilter
            itemList={itemList}
            setItemList={setItemList}
            id={item.id}
            item={item}
            amount={item.amount}
            name={item.name}
          />
        ))}
      </ul>
    </div>
  );
};

export default ItemList;
