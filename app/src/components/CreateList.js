import React from "react";

//solana
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";

import idl from "./idl.json";

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
}) => {
  //SOLANA
  // SystemProgram is a reference to the Solana runtime!
  const { SystemProgram, Keypair } = web3;

  // Array to hold list of ListAccount pubkeys.

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

    try {
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

      //stores list data in Todos array
      setTodos([
        ...todos,
        {
          text: list.name,
          id: listAccount,
          owner: list.owner,
          lines: list.lines,
          completed: false,
        },
      ]);
    } catch (error) {
      console.log("Error creating account:", error);
    }

    //reset inputtext
    setInputText("");
  };

  //update inputText displayed while typing in text box
  const inputTextHandler = (e) => {
    setInputText(e.target.value);
    console.log(inputText);
  };

  //update from dropdown menu selection
  const statusHandler = (e) => {
    setStatus(e.target.value);
    setList(e.target.value);
    setItemStatus(e.target.value);
    console.log(e.target.value);
  };

  return (
    <form>
      <div className="select">
        <select onChange={statusHandler} name="todos" className="filter-todo">
          <option value="All">Select Account</option>
          {todos.map((todo) => (
            <option key={todo.id}>{todo.text}</option>
          ))}
        </select>
      </div>
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
    </form>
  );
};

export default Form;
