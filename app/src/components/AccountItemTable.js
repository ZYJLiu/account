import React from "react";

const AccountItemTable = ({ itemList, todos, total, setTotal }) => {
  const test = [];
  let sum = 0;

  for (let i = 0, len = todos.length; i < len; i++) {
    // console.log(i, "Account:", todos[i].text);
    test.push(
      <ul className="todo">
        Account {i + 1}: {todos[i].text}
      </ul>
    );
    for (let j = 0, len = itemList.length; j < len; j++) {
      if (todos[i].id === itemList[j].list) {
        // console.log("Item:", itemList[j].name);
        test.push(
          <ul className="todo">
            Item: {itemList[j].name} Amount: {itemList[j].amount.toString()}
          </ul>
        );
        sum += itemList[j].amount;
        // console.log("test", sum);
      }
    }
    test.push(<ul>.</ul>);
  }

  setTotal(sum);
  test.push(<ul className="todo">Total: {total.toString()}</ul>);

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
