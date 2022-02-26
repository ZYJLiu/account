import React from "react";
//solana
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import idl from "./idl.json";

const NetIncome = ({ itemList, setItemList, todos }) => {
  //   var AccountID = "";

  let NetIncome = 0;

  for (let i = 0, len = todos.length; i < len; i++) {
    if (todos[i].name === "Revenue") {
      var AccountID = todos[i].id;
      console.log("found account", todos[i]);
      for (let i = 0, len = itemList.length; i < len; i++) {
        if (itemList[i].creator === AccountID) {
          NetIncome += itemList[i].amount;
          console.log(itemList[i].name, itemList[i].amount);
        }
      }
    }
    if (todos[i].name === "Expense") {
      var AccountID = todos[i].id;
      console.log("found account", todos[i]);
      for (let i = 0, len = itemList.length; i < len; i++) {
        if (itemList[i].creator === AccountID) {
          NetIncome -= itemList[i].amount;
          console.log(itemList[i].name, itemList[i].amount);
        }
      }
    }
  }

  //updating Retained Earning on Local - to fix
  itemList.forEach((item, index) => {
    if (item.name === "Retained Earning") {
      console.log(itemList[index]);
      itemList[index].amount = NetIncome;
      console.log(itemList[index]);
    }
  });

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
          <td width="213">Net Income</td>
          <td align="right">{NetIncome}</td>
        </tbody>
      </table>
    </div>
  );
};

export default NetIncome;
