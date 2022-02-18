import React from "react";

//solana
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import idl from "./idl.json";

const AccountItemTable = ({ itemList, todos, total, setTotal }) => {
  const test = [];
  let sum = 0;

  // for (let i = 0, len = todos.length; i < len; i++) {
  //   test.push(<ul className="todo">Account - {todos[i].text}</ul>);
  //   for (let j = 0, len = itemList.length; j < len; j++) {
  //     if (todos[i].id === itemList[j].list) {
  //       test.push(
  //         <ul className="todo">
  //           Item: {itemList[j].name} --- Amount: {itemList[j].amount.toString()}
  //         </ul>
  //       );
  //     }
  //   }
  //   test.push(<ul>|</ul>);
  // }

  //sum = Rev - Exp
  const coffee = "ANmS1W8bJbn3dSjVUJPakFMvVxq9HZXLVHafxB4sUQiD";
  const salary = "GBX5fv7wfZQ33yRwmzhDiCwHWbJ25MuSVV79QsdHJZai";

  test.push(<ul className="account">Revenue</ul>);
  itemList.map((item) => {
    if (item.id.toString() === coffee) {
      test.push(
        <ul className="todo">
          {item.name}: {item.amount.toString()}
        </ul>
      );
      sum += item.amount;
      console.log("AMOUNT:", item.amount);
    }
  });

  test.push(<ul>|</ul>);

  test.push(<ul className="account">Expense</ul>);
  itemList.map((item) => {
    if (item.id.toString() === salary) {
      test.push(
        <ul className="todo">
          {item.name}: {item.amount.toString()}
        </ul>
      );
      sum -= item.amount;
      console.log("AMOUNT:", item.amount);
    }
  });
  test.push(<ul>|</ul>);

  setTotal(sum);

  test.push(<ul className="todo">Net Income: {total}</ul>);

  return (
    <div className="todo-container">
      <ul className="todo-list">{test}</ul>
    </div>
  );
};

export default AccountItemTable;

// const table = todos.map((account) => (
//   <li key={account.id}>{account.text}</li>
// ));
