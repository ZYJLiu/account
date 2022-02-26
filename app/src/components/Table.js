import React from "react";

const Table = ({ itemList, todos, accountName }) => {
  // console.log("Accounts", todos[1].lines[0].toString());
  // console.log("Items", itemList);

  var AccountID = "";
  // console.log(accountName);

  for (let i = 0, len = todos.length; i < len; i++) {
    if (todos[i].name === accountName) {
      var AccountID = todos[i].id;
      // console.log("found account", todos[i]);
    }
  }

  return (
    <div className="todo-container">
      <table>
        <thead>
          <tr>
            <th colSpan="2" align="center">
              {accountName}
            </th>
          </tr>
        </thead>

        <thead>
          <tr>
            <th>Item</th>
            <th align="right">Amount</th>
          </tr>
        </thead>
        <tbody>
          {itemList
            .filter((item) => item.creator === AccountID)
            .map((item) => (
              <tr>
                <td width="350px">{item.name}</td>
                <td align="right">{item.amount.toString()}</td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
