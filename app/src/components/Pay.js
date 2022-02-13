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

  const pay = async (e) => {
    e.preventDefault();

    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    console.log("ping");
    console.log(provider.wallet.publicKey.toString());

    const pub2 = "J7U25ESC5ahUrYYdoHJvjv2BvCuKA9WitwZ5cgJ1CAhD";
    const pub = "84gwQnfpN5QKzoP1ArS8gPdegNTshyhE3hVquCJAC1nA";

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
            amount: item1.amount,
          };
        }
        return item;
      })
    );

    console.log("itemList[1] ", itemList[1].id.toString());
    console.log("itemList[1] ", itemList[1]);

    let amount = item1.amount.toString();
    let amount2 = item2.amount.toString();
    console.log("ItemKey1 toString ", ItemKey1.toString());
    console.log("item1 ", item1);
    console.log("item2 ", item2);
    console.log("item1 amount ", item1.amount.toString());
    console.log("item2 amount ", item2.amount.toString());

    let connection = new web3.Connection(clusterApiUrl("devnet"));
    const Key = new PublicKey("2Dbi1BTTVFeL8KD5r9sUxxdyjUbwFCGQ2eEWNpdvrYWs");
    const balance = await connection.getBalance(Key);
    console.log("Remaining SOL Balance ", balance / LAMPORTS_PER_SOL);

    Store.addNotification({
      title: "Item 2",
      message: "New Amount: " + amount2,
      type: "warning",
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
      title: "Item 1",
      message: "New Amount: " + amount,
      type: "default",
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

    Store.addNotification({
      title: "Payment Success!",
      message: "Sent 1 Sol",
      type: "success",
      insert: "top",
      container: "top-right",
      animationIn: ["animate__animated", "animate__backInRight"],
      animationOut: ["animate__animated", "animate__fadeOut"],
      dismiss: {
        duration: 2000,
        onScreen: true,
        showIcon: true,
      },
    });

    setReceiver("");
  };

  const inputTextHandler = (e) => {
    // console.log(e.target.value);
    setReceiver(e.target.value);
    // console.log(receiver);
  };

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
      <ul>4B65V1ySBG35UbStDTUDvBTXRfxh6v5tRbLnVrVLpYD2</ul>
      <ul>2Dbi1BTTVFeL8KD5r9sUxxdyjUbwFCGQ2eEWNpdvrYWs</ul>
    </div>
  );
};

export default Pay;
