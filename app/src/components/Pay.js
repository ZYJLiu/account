import React from "react";

//solana
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";

import idl from "./idl.json";

import { useNotify } from "./notify";

const Pay = () => {
  const notify = useNotify();

  const BN = require("bn.js");

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

  const pay = async (e) => {
    e.preventDefault();

    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    console.log("ping");
    // console.log(provider.wallet.publicKey.toString());

    //4B65V1ySBG35UbStDTUDvBTXRfxh6v5tRbLnVrVLpYD2
    // 2Dbi1BTTVFeL8KD5r9sUxxdyjUbwFCGQ2eEWNpdvrYWs
    try {
      await program.rpc.pay(new BN(1), {
        accounts: {
          item1: "4HxYGgMre7F5QtmdACPZoV6U8T8xowT5Qe9sgxPcWsnd",
          item2: "6ZEDarPhTmaXQ4KrVF6Mm1KKej1ypvp1zsCZbE56D3y3",
          receiver: "2Dbi1BTTVFeL8KD5r9sUxxdyjUbwFCGQ2eEWNpdvrYWs",
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
      });
    } catch (error) {
      console.log("Error Pay:", error);
    }

    let item = await program.account.dataAccount.fetch(
      "6ZEDarPhTmaXQ4KrVF6Mm1KKej1ypvp1zsCZbE56D3y3"
    );
    console.log("Item Amount:", item.amount.toString());
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "5vh",
      }}
    >
      <button onClick={pay} className="complete-btn">
        <i className="fas fa-smile"></i> Pay (1 SOL)
      </button>
    </div>
  );
};

export default Pay;
