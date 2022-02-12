import React from "react";

const ItemFilter = ({ itemList, setItemList, item }) => {
  //events
  const deleteHandler = () => {
    setItemList(itemList.filter((el) => el.id !== item.id));
    console.log(item);
    console.log(item.id.toString());
    console.log(item.amount);
  };

  return (
    <div className="todo">
      <li className={`todo-item`}>
        <option key={item.id}>
          Item: {item.name} {"-"} Amount: ${item.amount.toString()}
        </option>
      </li>
      <button onClick={deleteHandler} className="trash-btn">
        <i className="fas fa-trash"></i>
      </button>
    </div>
  );
};

export default ItemFilter;
