import React from "react";

const AccountItemTable = ({ itemList, todos, accountName }) => {
  // console.log("Accounts", todos[1].lines[0].toString());
  // console.log("Items", itemList);

  const test = [];
  var AccountID = "";
  // console.log(accountName);

  for (let i = 0, len = todos.length; i < len; i++) {
    if (todos[i].name === accountName) {
      test.push(<ul className="account">{todos[i].name}</ul>);
      var AccountID = todos[i].id;
      // console.log("found account", todos[i]);
    }
  }

  for (let i = 0, len = itemList.length; i < len; i++) {
    if (itemList[i].creator === AccountID) {
      test.push(
        <ul className="table">
          {itemList[i].name}: {itemList[i].amount.toString()}
        </ul>
      );
      // console.log("item", itemList[i].name, "amount", itemList[i].amount);
    }
  }

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

  // test.push(<ul className="account">Revenue</ul>);
  // itemList.map((item) => {
  //   if (item.id.toString() === coffee) {
  //     test.push(
  //       <ul className="todo">
  //         {item.name}: {item.amount.toString()}
  //       </ul>
  //     );
  //     sum += item.amount;
  //     console.log("AMOUNT:", item.amount);
  //   }
  // });

  // test.push(<ul className="account">Expense</ul>);
  // itemList.map((item) => {
  //   if (item.id.toString() === salary) {
  //     test.push(
  //       <ul className="todo">
  //         {item.name}: {item.amount.toString()}
  //       </ul>
  //     );
  //     sum -= item.amount;
  //     console.log("AMOUNT:", item.amount);
  //   }
  // });

  return (
    <div className="todo-container">
      <ul className="todo-list">{test}</ul>
    </div>
  );
};

export default AccountItemTable;
