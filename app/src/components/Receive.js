import React from "react";

//solana
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";

import idl from "./idl.json";

//notification
import { ReactNotifications, Store } from "react-notifications-component";
import "react-notifications-component/dist/theme.css";
import "animate.css/animate.min.css";

const Receive = ({
  setReceiver,
  itemList,
  setItemList,
  itemOne,
  itemTwo,
  itemThree,
  button,
  number,
}) => {
  const BN = require("bn.js");
  const anchor = require("@project-serum/anchor");
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

  const receive = async () => {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    console.log("ping");
    console.log(provider.wallet.publicKey.toString());

    let connection = new web3.Connection(clusterApiUrl("devnet"));
    const Key = new PublicKey("2Dbi1BTTVFeL8KD5r9sUxxdyjUbwFCGQ2eEWNpdvrYWs");
    const balance = Math.round(
      (await connection.getBalance(Key)) / LAMPORTS_PER_SOL
    );
    // console.log("Remaining SOL Balance ", balance / LAMPORTS_PER_SOL);

    var pub = "";
    var pub2 = "";
    var pub3 = "";

    for (let i = 0, len = itemList.length; i < len; i++) {
      if (itemList[i].name === itemOne) {
        var pub = itemList[i].id;
        // console.log("item", itemList[i].name, "amount", itemList[i].amount);
      }
      if (itemList[i].name === itemTwo) {
        var pub2 = itemList[i].id;
        // console.log("item", itemList[i].name, "amount", itemList[i].amount);
      }
      if (itemList[i].name === itemThree) {
        var pub3 = itemList[i].id;
        // console.log("item", itemList[i].name, "amount", itemList[i].amount);
      }
    }

    try {
      console.log(number);
      await program.rpc.receive(new anchor.BN(number), {
        accounts: {
          item1: pub,
          item2: pub2,
          item3: pub3,
          payer: provider.wallet.publicKey,
          user: "2Dbi1BTTVFeL8KD5r9sUxxdyjUbwFCGQ2eEWNpdvrYWs",
          systemProgram: SystemProgram.programId,
        },
      });
    } catch (error) {
      console.log("Error Pay:", error);
    }

    //fetch amounts from item accounts
    const item1 = await program.account.dataAccount.fetch(pub);
    const item2 = await program.account.dataAccount.fetch(pub2);
    const item3 = await program.account.dataAccount.fetch(pub3);

    let amount = item1.amount.toNumber();
    let amount2 = item2.amount.toNumber();
    let amount3 = item3.amount.toNumber();

    //Increment respecting account amounts
    setItemList(
      itemList.map((item) => {
        if (item.id.toString() === pub) {
          return {
            ...item,
            amount: amount,
          };
        }
        if (item.id.toString() === pub2) {
          return {
            ...item,
            amount: amount2,
          };
        }
        if (item.id.toString() === pub3) {
          return {
            ...item,
            amount: amount3,
          };
        }
        return item;
      })
    );

    // Store.addNotification({
    //   title: "Item 2",
    //   message: "New Amount: " + amount2,
    //   type: "warning",
    //   insert: "top",
    //   container: "top-right",
    //   animationIn: ["animate__animated", "animate__backInRight"],
    //   animationOut: ["animate__animated", "animate__fadeOut"],
    //   dismiss: {
    //     duration: 5000,
    //     onScreen: true,
    //     showIcon: true,
    //   },
    // });

    // Store.addNotification({
    //   title: "Item 1",
    //   message: "New Amount: " + amount,
    //   type: "default",
    //   insert: "top",
    //   container: "top-right",
    //   animationIn: ["animate__animated", "animate__backInRight"],
    //   animationOut: ["animate__animated", "animate__fadeOut"],
    //   dismiss: {
    //     duration: 4000,
    //     onScreen: true,
    //     showIcon: true,
    //   },
    // });

    Store.addNotification({
      title: "Transaction Success!",
      message: "SOL Received",
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__backInRight"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 3000,
        onScreen: true,
        showIcon: true,
      },
    });

    setReceiver("");
  };

  return (
    <div>
      <ReactNotifications />
      <button onClick={receive} className="button">
        <img src={button} />
      </button>
    </div>
  );
};

export default Receive;
