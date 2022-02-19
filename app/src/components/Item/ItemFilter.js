import React from "react";

//solana
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import idl from "../idl.json";

const ItemFilter = ({ id, itemList, setItemList, item }) => {
  //SOLANA
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

  //events
  const deleteHandler = async (e) => {
    setItemList(itemList.filter((el) => el.id !== item.id));
    const provider = getProvider();
    const program = new Program(idl, programID, provider);

    const items = await program.account.dataAccount.all();
    console.log("All item", items);

    //Close All Item Accounts
    await program.rpc.cancelitem(provider.wallet.publicKey, {
      accounts: {
        item: id,
        itemCreator: provider.wallet.publicKey,
        user: provider.wallet.publicKey,
      },
    });
  };

  return (
    <div className="todo">
      <li className={`todo-item`}>
        <option key={item.id}>
          Item: {item.name} {"-"} Amount: {item.amount.toString()}
        </option>
      </li>
      <button onClick={deleteHandler} className="trash-btn">
        <i className="fas fa-trash"></i>
      </button>
    </div>
  );
};

export default ItemFilter;
