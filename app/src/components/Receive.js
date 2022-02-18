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

import logo from "../assets/pay.svg";

const Receive = ({
  receiver,
  setReceiver,
  filteredItems,
  setFilteredItems,
  itemList,
  setItemList,
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

  const receive = async (e) => {
    e.preventDefault();

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

    const pub = "DVzQNPYtJM5ExgbeaYKskvwNMVoiVsEGtpd8bV7hAFB7";
    const pub2 = "ANmS1W8bJbn3dSjVUJPakFMvVxq9HZXLVHafxB4sUQiD";

    try {
      await program.rpc.receive(new anchor.BN(1), {
        accounts: {
          item1: pub,
          item2: pub2,
          payer: provider.wallet.publicKey,
          user: "2Dbi1BTTVFeL8KD5r9sUxxdyjUbwFCGQ2eEWNpdvrYWs",
          systemProgram: SystemProgram.programId,
        },
      });
    } catch (error) {
      console.log("Error Pay:", error);
    }

    //2Dbi1BTTVFeL8KD5r9sUxxdyjUbwFCGQ2eEWNpdvrYWs

    const ItemKey1 = new PublicKey(pub);
    const ItemKey2 = new PublicKey(pub2);

    const item1 = await program.account.dataAccount.fetch(pub);
    const item2 = await program.account.dataAccount.fetch(pub2);

    //Increment respecting account amounts
    setItemList(
      itemList.map((item) => {
        if (item.id.toString() === pub2) {
          return {
            ...item,
            amount: item2.amount,
          };
        }
        if (item.id.toString() === pub) {
          return {
            ...item,
            amount: (item.amount += 1),
          };
        }
        return item;
      })
    );

    // console.log("itemList[1] ", itemList[1].id.toString());
    // console.log("itemList[1] ", itemList[1]);

    let amount = item1.amount.toString();
    let amount2 = item2.amount.toString();
    // console.log("ItemKey1 toString ", ItemKey1.toString());
    // console.log("item1 ", item1);
    // console.log("item2 ", item2);
    // console.log("item1 amount ", item1.amount.toString());
    // console.log("item2 amount ", item2.amount.toString());

    Store.addNotification({
      title: "Item 2",
      message: "New Amount: " + amount2,
      type: "warning",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__backInRight"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 5000,
        onScreen: true,
        showIcon: true,
      },
    });

    Store.addNotification({
      title: "Item 1",
      message: "New Amount: " + balance,
      type: "default",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__backInRight"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 4000,
        onScreen: true,
        showIcon: true,
      },
    });

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
  };

  // const inputTextHandler = (e) => {
  //   // console.log(e.target.value);
  //   setReceiver(e.target.value);
  //   // console.log(receiver);
  // };

  return (
    <div
    // style={{
    //   display: "inline",
    //   justifyContent: "center",
    //   alignItems: "center",
    //   height: "5vh",
    // }}
    >
      <ReactNotifications />
      <ul>
        This Buy Button Represents Customer Paying 1 SOL to Business Wallet
      </ul>
      <button onClick={receive} className="button">
        <img src={logo} />
        {/* <i className="fas fa-smile"></i> Pay (1 SOL) */}
      </button>
    </div>
  );
};

export default Receive;
