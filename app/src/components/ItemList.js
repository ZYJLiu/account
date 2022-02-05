import React from 'react';
//import component
import Item from './Item'


const ItemList = ({itemList, setItemList}) =>{
    console.log(itemList);
    return (
        <div className="todo-container">
            <ul className="todo-list">
                <div className="todo">
                    <li className="todo-item">
                        {itemList.map((itemList) => <option key={itemList.id}> name: {itemList.name} - amount: {itemList.amount.toNumber()}</option>)}
                    </li>
                </div>
            </ul>
        </div>
        
    );
};

export default ItemList;




