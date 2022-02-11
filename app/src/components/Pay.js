import React from "react";

//solana
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";

import idl from "./idl.json";

//notification
import { ReactNotifications, Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "animate.css/animate.min.css";

import logo from "../assets/pay2.svg";

const Pay = () => {
  const BN = require("bn.js");
  const anchor = require("@project-serum/anchor");
  //   console.log(pubkey);

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
    console.log(provider.wallet.publicKey.toString());

    try {
      await program.rpc.pay(new anchor.BN(1), {
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
    console.log(item.amount.toString());

    Store.addNotification({
      title: "Success!",
      message: "Sent 1 SOL",
      type: "default",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__backInRight"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 2500,
        onScreen: true,
        showIcon: true,
      },
    });
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
      {" "}
      <ReactNotifications />
      <button onClick={pay} className="button">
        <img src={logo} />
        {/* <i className="fas fa-smile"></i> Pay (1 SOL) */}
      </button>
    </div>
  );
};

export default Pay;
