import React from "react";

//solana
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import idl from "../idl.json";

import Todo from "./AccountFilter";

import { Buffer } from "buffer";
window.Buffer = Buffer;

const Form = ({
  inputText,
  setInputText,
  todos,
  setTodos,
  setStatus,
  setList,
  setItemStatus,
  filteredTodos,
}) => {
  //SOLANA
  // SystemProgram is a reference to the Solana runtime!
  const { SystemProgram, Keypair } = web3;

  // Get our program's id from the IDL file.
  const programID = new PublicKey(idl.metadata.address);

  // Set our network to devnet.
  const network = clusterApiUrl("devnet");

  // Controls how we want to acknowledge when a transaction is "done".
  const opts = {
    preflightCommitment: "processed",
  };

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection,
      window.solana,
      opts.preflightCommitment
    );
    return provider;
  };

  //create new account
  const createAccount = async (e) => {
    e.preventDefault();

    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    console.log("ping");

    const name = inputText;
    const capacity = 16;
    const [listAccount, bump] = await web3.PublicKey.findProgramAddress(
      ["list", provider.wallet.publicKey.toBytes(), name.slice(0, 32)],
      program.programId
    );

    //create new List, calls createList function from Anchor program
    await program.rpc.createList(name, capacity, bump, {
      accounts: {
        list: listAccount, //
        user: provider.wallet.publicKey,
        systemProgram: SystemProgram.programId,
      },
    });

    let list = await program.account.list.fetch(listAccount);

    // stores list data in Todos array
    setTodos((todos) => [
      ...todos,
      {
        name: list.name,
        id: listAccount,
        owner: list.owner,
        lines: list.lines,
      },
    ]);

    //reset input text
    setInputText("");

    // const list = await program.account.list.all();
    // console.log("All list", list);

    // const allAccounts = [];

    // for (var i = 0; i < list.length; i++) {
    //   allAccounts.push({
    //     name: list[i].account.name,
    //     id: list[i].publicKey.toString(),
    //     owner: list[i].account.owner.toString(),
    //     lines: list[i].account.lines,
    //   });
    // }

    // console.log("todos", allAccounts);

    // setTodos((todos) => [todos, allAccounts]);

    // console.log("test again", todos);
  };

  //update inputText displayed while typing in text box
  const inputTextHandler = (e) => {
    setInputText(e.target.value);
    console.log(inputText);
  };

  //TODO FETCH ACCOUNTS FROM NETWORK
  //update from dropdown menu selection
  const statusHandler = (e) => {
    setStatus(e.target.value);
    setList(e.target.value);
    setItemStatus(e.target.value);
    console.log(e.target.value);
  };

  return (
    <div>
      <form>
        <div className="select">
          <select onChange={statusHandler} name="todos" className="filter-todo">
            <option value="All">Select Account</option>
            {todos.map((todo) => (
              <option key={todo.id}>{todo.name}</option>
            ))}
          </select>
        </div>
        <ul>Create Account and Line Items Below</ul>

        <div className="input">
          <input
            value={inputText}
            onChange={inputTextHandler}
            type="text"
            className="todo-input"
            placeholder="Create Account"
          />
          <button onClick={createAccount} className="todo-button" type="submit">
            <i className="fas fa-plus-square"></i>
          </button>
        </div>
      </form>
      <div className="todo-container">
        <ul className="todo-list">
          {filteredTodos.map((todo) => (
            <Todo
              setTodos={setTodos}
              todos={todos}
              key={todo.id}
              id={todo.id}
              lines={todo.lines}
              name={todo.name}
              todo={todo}
              owner={todo.owner}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Form;
