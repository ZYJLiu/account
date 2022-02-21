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

import logo from "../assets/pay2.svg";

const Pay = ({
  receiver,
  setReceiver,
  itemList,
  setItemList,
  itemOne,
  itemTwo,
}) => {
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

  const pay = async () => {
    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    console.log("ping");
    console.log(provider.wallet.publicKey.toString());

    let connection = new web3.Connection(clusterApiUrl("devnet"));
    const Key = new PublicKey("2Dbi1BTTVFeL8KD5r9sUxxdyjUbwFCGQ2eEWNpdvrYWs");
    const balance = Math.round(
      (await connection.getBalance(Key)) / LAMPORTS_PER_SOL
    );
    console.log("Remaining SOL Balance ", balance / LAMPORTS_PER_SOL);

    var pub = "";
    var pub2 = "";

    for (let i = 0, len = itemList.length; i < len; i++) {
      if (itemList[i].name === itemOne) {
        var pub = itemList[i].id;
        console.log("item", itemList[i].name, "amount", itemList[i].amount);
      }
      if (itemList[i].name === itemTwo) {
        var pub2 = itemList[i].id;
        console.log("item", itemList[i].name, "amount", itemList[i].amount);
      }
    }

    try {
      await program.rpc.pay(new anchor.BN(1), {
        accounts: {
          item1: pub,
          item2: pub2,
          receiver: receiver.toString(),
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
      });
    } catch (error) {
      console.log("Error Pay:", error);
    }

    const item1 = await program.account.dataAccount.fetch(pub);
    console.log(item1);
    const item2 = await program.account.dataAccount.fetch(pub2);

    let amount = item1.amount;
    let amount2 = item2.amount.toNumber();

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
      title: "Payment Success!",
      message: "Sent 1 Sol",
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
    console.log(itemList);
  };

  const inputTextHandler = (e) => {
    // console.log(e.target.value);
    setReceiver(e.target.value);
    // console.log(receiver);
  };

  return (
    <div>
      <ReactNotifications />

      <button onClick={pay} className="button">
        <img src={logo} />
        {/* <i className="fas fa-smile"></i> Pay (1 SOL) */}
      </button>
      <form>
        <input
          value={receiver}
          onChange={inputTextHandler}
          type="text"
          placeholder="Receipient"
        />
      </form>
      <ul>Vendor Pubkey: 4B65V1ySBG35UbStDTUDvBTXRfxh6v5tRbLnVrVLpYD2</ul>
      <ul>Business Pubkey: 2Dbi1BTTVFeL8KD5r9sUxxdyjUbwFCGQ2eEWNpdvrYWs</ul>
    </div>
  );
};

export default Pay;
