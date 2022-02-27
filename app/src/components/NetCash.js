import React from "react";

const NetCash = ({ itemList, setItemList, todos }) => {
  //   var AccountID = "";

  let Inflow = 0;
  let Outflow = 0;

  for (let i = 0, len = itemList.length; i < len; i++) {
    if (itemList[i].name.includes("Inflow")) {
      Inflow += itemList[i].amount;
      console.log(itemList[i].name, itemList[i].amount);
    }
  }

  for (let i = 0, len = itemList.length; i < len; i++) {
    if (itemList[i].name.includes("Outflow")) {
      Outflow += itemList[i].amount;
      console.log(itemList[i].name, itemList[i].amount);
    }
  }

  return (
    <div className="todo-container">
      <table>
        <thead>
          <tr>
            <th colSpan="2" align="center">
              Total
            </th>
          </tr>
        </thead>
        <tbody>
          <td width="213">Net Cash</td>
          <td align="right">{Inflow - Outflow}</td>
        </tbody>
      </table>
    </div>
  );
};

export default NetCash;
