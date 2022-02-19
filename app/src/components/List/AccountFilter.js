import React from "react";

//solana
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import idl from "../idl.json";

const Todo = ({ name, owner, id, todo, todos, setTodos }) => {
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

  const deleteHandler = async (e) => {
    setTodos(todos.filter((el) => el.id !== todo.id));
    console.log(todo.id);

    // e.preventDefault();

    const provider = getProvider();
    const program = new Program(idl, programID, provider);

    await program.rpc.cancellist(name, {
      accounts: {
        list: id,
        owner: owner,
        itemCreator: provider.wallet.publicKey,
        user: provider.wallet.publicKey,
      },
    });
  };

  return (
    <div className="todo">
      <li className={`todo-item ${todo.completed}`}>{name}</li>
      <button onClick={deleteHandler} className="trash-btn">
        <i className="fas fa-trash"></i>
      </button>
    </div>
  );
};

export default Todo;
