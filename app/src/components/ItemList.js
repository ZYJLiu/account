import React from "react";
//import component
import Item from "./Item";

const ItemList = ({ filteredItems }) => {
  return (
    <div className="todo-container">
      <ul className="todo-list">
        <div className="todo">
          <li className="todo-item">
            {filteredItems.map((itemList) => (
              <option key={itemList.id}>
                Amount: {itemList.amount.toNumber()}
              </option>
            ))}
          </li>
          {/*                     
                    <li className="todo-item">
                        {itemList.map((itemList) => <option key={itemList.id}> Amount: {itemList.amount.toNumber()}</option>)}
                    </li> */}
        </div>
      </ul>
    </div>
  );
};

export default ItemList;
