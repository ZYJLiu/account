import React from "react";
//import component
import Item from "./Item";

const ItemList = ({ filteredItems }) => {
  // console.log(itemList);
  // console.log(list)

  // let listkey = todos.find(todo => {
  //     if (list ===  todo.text) return todo;
  // } );
  //   console.log(listkey.id)

  // const setFilteredItems(itemList.map(item => {
  //     if(item.list === listkey.id)
  //     return item;
  // }))

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
