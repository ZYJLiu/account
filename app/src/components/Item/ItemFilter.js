import React from "react";

const ItemFilter = ({ itemList, setItemList, item }) => {
  //events
  const deleteHandler = () => {
    setItemList(itemList.filter((el) => el.id !== item.id));
  };

  return (
    <div className="todo">
      <li className={`todo-item`}>
        <option key={item.id}>
          Item: {item.name} {"-"} Amount: {item.amount.toString()}
        </option>
      </li>
      <button onClick={deleteHandler} className="trash-btn">
        <i className="fas fa-trash"></i>
      </button>
    </div>
  );
};

export default ItemFilter;
