import React from "react";

//solana
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";

import idl from "./idl.json";

import { Buffer } from "buffer";
window.Buffer = Buffer;

const Item = ({
  itemText,
  setItemText,
  todos,
  list,
  itemList,
  setItemList,
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

  const createItem = async (e) => {
    e.preventDefault();

    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      const name = list;

      let listkey = todos.find((todo) => {
        if (name === todo.text) return todo;
      });

      //create pubkey for item
      const itemAccount = web3.Keypair.generate();

      //call addItem function from Anchor program
      await program.rpc.addItem(listkey.text, itemText, {
        accounts: {
          list: listkey.id,
          owner: listkey.owner,
          item: itemAccount.publicKey,
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        signers: [itemAccount],
      });

      let item = await program.account.dataAccount.fetch(itemAccount.publicKey);
      console.log(itemAccount.publicKey.toString());

      //add created item to ItemList
      setItemList([
        ...itemList,
        {
          creator: item.creator,
          name: item.name,
          amount: item.amount,
          id: itemAccount.publicKey,
          list: listkey.id,
        },
      ]);
    } catch (error) {
      console.log("Error creating item:", error);
    }

    setItemText("");
  };

  //update ItemText while typing in textbox
  const inputTextHandler = (e) => {
    setItemText(e.target.value);
  };

  return (
    <form>
      <input
        value={itemText}
        onChange={inputTextHandler}
        type="text"
        className="todo-input"
        placeholder="Create Line Item"
      />
      <button onClick={createItem} className="todo-button" type="submit">
        <i className="fas fa-plus-square"></i>
      </button>
    </form>
  );
};

export default Item;
