import React from "react";
import ItemFilter from "./ItemFilter";

//solana
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";

import idl from "../idl.json";

import { Buffer } from "buffer";
window.Buffer = Buffer;

const Item = ({
  itemText,
  setItemText,
  todos,
  list,
  itemList,
  setItemList,
  filteredItems,
}) => {
  //SOLANA
  // SystemProgram is a reference to the Solana runtime!
  const { SystemProgram } = web3;

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
        if (name === todo.name) return todo;
      });

      console.log("listkey", listkey);

      //create pubkey for item
      const itemAccount = web3.Keypair.generate();

      // call addItem function from Anchor program
      await program.rpc.addItem(listkey.name, itemText, {
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
      console.log("This is the item", item.creator.toString());

      // add created item to ItemList
      setItemList((itemList) => [
        ...itemList,
        {
          id: itemAccount.publicKey.toString(),
          creator: item.creator.toString(),
          name: item.name,
          amount: item.amount.toNumber(),
        },
      ]);
    } catch (error) {
      console.log("Error creating item:", error);
    }
    setItemText("");
  };

  console.log(itemList);

  //update ItemText while typing in textbox
  const inputTextHandler = (e) => {
    setItemText(e.target.value);
  };

  return (
    <div>
      <form>
        <div className="input">
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
        </div>
      </form>
      <div className="todo-container">
        <ul className="todo-list">
          {filteredItems.map((item) => (
            <ItemFilter
              itemList={itemList}
              setItemList={setItemList}
              id={item.id}
              item={item}
              amount={item.amount}
              name={item.name}
            />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default Item;
