import React from "react";
//solana
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import idl from "./idl.json";

const CloseAccounts = (setItemList, itemList, item, todos, setTodos) => {
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

  const closeAccount = async (e) => {
    e.preventDefault();

    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    console.log("ping");
    console.log(provider.wallet.publicKey.toString());

    const list = await program.account.list.all();
    console.log("All list", list);

    //CLOSE ALL LIST ACCOUNTS
    for (var i = 0; i < list.length; i++) {
      await program.rpc.cancellist(list[i].account.name, {
        accounts: {
          list: list[i].publicKey,
          owner: list[i].account.owner,
          itemCreator: provider.wallet.publicKey,
          user: provider.wallet.publicKey,
        },
      });
    }
  };

  const closeItem = async (e) => {
    e.preventDefault();

    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    console.log("ping");
    console.log(provider.wallet.publicKey.toString());

    const items = await program.account.dataAccount.all();
    console.log("All item", items);

    //Close All Item Accounts
    for (var i = 0; i < items.length; i++) {
      console.log(items[i].account.creator);
      await program.rpc.cancelitem(provider.wallet.publicKey, {
        accounts: {
          item: items[i].publicKey,
          itemCreator: provider.wallet.publicKey,
          user: provider.wallet.publicKey,
        },
      });
    }
  };

  return (
    <div>
      <ul>
        <button onClick={closeAccount} className="cta-button">
          Close Accounts
        </button>
      </ul>
      <ul>
        <button onClick={closeItem} className="cta-button">
          Close Items
        </button>
      </ul>
    </div>
  );
};

export default CloseAccounts;
