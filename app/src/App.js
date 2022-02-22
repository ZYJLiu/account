//react
import React, { useState, useEffect } from "react";
import "./App.css";

//import components
import Form from "./components/List/CreateList";
import Item from "./components/Item/CreateItem";
import Pay from "./components/Pay";
import Receive from "./components/Receive";
import AccountItemTable from "./components/AccountItemTable";
import CloseAccounts from "./components/CloseAccounts";
import NetIncome from "./components/NetIncome";

//navbar
import Navbar from "./components/Navbar/Navbar.component";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/about";

//solana
import { Connection, PublicKey, clusterApiUrl } from "@solana/web3.js";
import { Program, Provider, web3 } from "@project-serum/anchor";
import idl from "./components/idl.json";

import BuyButton from "./assets/pay.svg";
import AddMoneyButton from "./assets/pay4.svg";

//GIF
const GIF = ["https://media.giphy.com/media/d4jBk4fb84sTyRmtxt/giphy.gif"];
const Debt = "https://media.giphy.com/media/YmtNb7rBb12sVWVU0Z/giphy.gif";
const Beer = "https://media.giphy.com/media/McO7leZ9pxTdHLaQeN/giphy.gif";
const Beer2 = "https://media.giphy.com/media/IeXeDDIxGrprESmSBT/giphy.gif";
const Coffee = "https://media.giphy.com/media/g0HiibIiGp2oWQjMy5/giphy.gif";
const Payment = "https://media.giphy.com/media/nbPGpGAg54Sfj1lr3h/giphy.gif";

function App() {
  //state
  const [inputText, setInputText] = useState("");
  const [itemText, setItemText] = useState("");
  const [todos, setTodos] = useState([]);
  const [status, setStatus] = useState("All");
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [list, setList] = useState("");
  const [itemList, setItemList] = useState([]);
  const [itemStatus, setItemStatus] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  //wallet
  const [walletAddress, setWalletAddress] = useState(null);

  //pay
  const [receiver, setReceiver] = useState("");

  //wallet stuff below
  /*
   * This function holds the logic for deciding if a Phantom Wallet is
   * connected or not
   */
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log("Phantom wallet found!");

          /*
           * The solana object gives us a function that will allow us to connect
           * directly with the user's wallet!
           */
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "Connected with Public Key:",
            response.publicKey.toString()
          );

          /*
           * Set the user's publicKey in state to be used later!
           */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert("Solana object not found! Get a Phantom Wallet 👻");
      }
    } catch (error) {
      console.error(error);
    }
  };

  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const fetchAccounts = async () => {
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

    const provider = getProvider();
    const program = new Program(idl, programID, provider);
    console.log("ping");

    const list = await program.account.list.all();
    const item = await program.account.dataAccount.all();

    const allAccounts = [];
    const allItems = [];

    for (var i = 0; i < list.length; i++) {
      allAccounts.push({
        name: list[i].account.name,
        id: list[i].publicKey.toString(),
        owner: list[i].account.owner.toString(),
        lines: list[i].account.lines,
      });
    }

    for (var i = 0; i < item.length; i++) {
      allItems.push({
        id: item[i].publicKey.toString(),
        creator: item[i].account.creator.toString(),
        name: item[i].account.name,
        amount: item[i].account.amount.toNumber(),
      });
    }

    setTodos(allAccounts);
    setItemList(allItems);
  };

  /*
   * We want to render this UI when the user hasn't connected
   * their wallet to our app yet.
   */
  const renderNotConnectedContainer = () => (
    <div className="connected-container">
      <button
        className="cta-button connect-wallet-button"
        onClick={connectWallet}
      >
        Connect to Wallet
      </button>
    </div>
  );

  const renderConnectedContainer = () => (
    <div className="connected-container">
      <div className="row">
        <div>
          <div className="gif-grid">
            <div className="gif-item">
              <img src={Debt} alt={Debt} />
            </div>
          </div>
          <ul>Debt</ul>
          <ul>This Button Represents Business taking loan of 3 SOL</ul>
          <Receive
            receiver={receiver}
            setReceiver={setReceiver}
            filteredItems={filteredItems}
            setFilteredItems={setFilteredItems}
            itemList={itemList}
            setItemList={setItemList}
            itemOne="Cash"
            itemTwo="Debt"
            button={AddMoneyButton}
            number={3}
          />
        </div>

        <div>
          <div className="gif-grid">
            <div className="gif-item">
              <img src={Coffee} alt={Coffee} />
            </div>
          </div>
          <ul>Coffee!</ul>
          <ul>Customer Paying 2 SOL to Business Wallet</ul>
          <Receive
            receiver={receiver}
            setReceiver={setReceiver}
            filteredItems={filteredItems}
            setFilteredItems={setFilteredItems}
            itemList={itemList}
            setItemList={setItemList}
            itemOne="Cash"
            itemTwo="Coffee"
            button={BuyButton}
            number={2}
          />
        </div>

        <div>
          <div className="gif-grid">
            <div className="gif-item">
              <img src={Beer2} alt={Beer2} />
            </div>
          </div>
          <ul>Beer!</ul>
          <ul>Customer Paying 2 SOL to Business Wallet</ul>
          <Receive
            receiver={receiver}
            setReceiver={setReceiver}
            filteredItems={filteredItems}
            setFilteredItems={setFilteredItems}
            itemList={itemList}
            setItemList={setItemList}
            itemOne="Cash"
            itemTwo="Beer"
            button={BuyButton}
            number={2}
          />
        </div>
      </div>

      <div>
        <div className="gif-grid">
          <div className="gif-item">
            <img src={Payment} alt={Payment} />
          </div>
        </div>
        <ul>Operating Expense</ul>
        <ul>Business Wallet Paying 1 SOL to Vendor Wallet</ul>
        <Pay
          receiver={receiver}
          setReceiver={setReceiver}
          filteredItems={filteredItems}
          setFilteredItems={setFilteredItems}
          itemList={itemList}
          setItemList={setItemList}
          itemOne="Cash"
          itemTwo="Operating Expense"
        />
      </div>

      <div className="row">
        <div className="space">
          <h1>Income Statement</h1>
          <AccountItemTable
            todos={todos}
            itemList={itemList}
            accountName="Revenue"
          />
          <AccountItemTable
            todos={todos}
            itemList={itemList}
            accountName="Expense"
          />
          <NetIncome
            todos={todos}
            itemList={itemList}
            setItemList={setItemList}
          />
        </div>

        <div className="space">
          <h1>Balance Sheet</h1>
          <AccountItemTable
            todos={todos}
            itemList={itemList}
            accountName="Asset"
          />
          <AccountItemTable
            todos={todos}
            itemList={itemList}
            accountName="Liability"
          />
          <AccountItemTable
            todos={todos}
            itemList={itemList}
            accountName="Equity"
          />
        </div>

        <div className="space">
          <h1>Account Creation</h1>
          <Form
            todos={todos}
            setTodos={setTodos}
            inputText={inputText}
            setInputText={setInputText}
            setStatus={setStatus}
            setList={setList}
            setItemStatus={setItemStatus}
            filteredItems={filteredItems}
            setFilteredItems={setFilteredItems}
            filteredTodos={filteredTodos}
          />
          <Item
            todos={todos}
            setTodos={setTodos}
            itemText={itemText}
            setItemText={setItemText}
            setStatus={setStatus}
            list={list}
            setList={setList}
            itemList={itemList}
            setItemList={setItemList}
            setFilteredItems={setFilteredItems}
            setItemStatus={setItemStatus}
            filteredItems={filteredItems}
          />
          <CloseAccounts
            todos={todos}
            setTodos={setTodos}
            setList={setList}
            itemList={itemList}
          />
        </div>
      </div>
    </div>
  );

  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
      await fetchAccounts();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  //runonce
  useEffect(() => {
    getLocalTodos();
  }, []);

  //use effect
  useEffect(() => {
    filterHandler();
    saveLocalTodos();
  }, [todos, status]);

  //functions
  const filterHandler = () => {
    if (status == "All") {
      setFilteredTodos(todos);
    } else {
      const name = list;
      setFilteredTodos(todos.filter((todo) => todo.name == name));
    }
  };

  //runonce
  useEffect(() => {
    getLocalItems();
  }, []);

  useEffect(() => {
    itemfilterHandler();
    saveLocalItems();
  }, [itemStatus, itemList]);

  const itemfilterHandler = () => {
    if (status == "All") {
      setFilteredItems(itemList);
    } else {
      const name = list;
      let listkey = todos.find((todo) => {
        if (name === todo.name) return todo;
      });

      console.log(listkey);

      setFilteredItems(itemList.filter((item) => item.creator == listkey.id));

      console.log(filteredItems);
    }
  };

  //save to local
  const saveLocalTodos = () => {
    localStorage.setItem("todos", JSON.stringify(todos));
  };

  const getLocalTodos = () => {
    if (localStorage.getItem("todos") === null) {
      localStorage.setItem("todos", JSON.stringify([]));
    } else {
      let todolocal = JSON.parse(localStorage.getItem("todos"));
      setTodos(todolocal);
    }
  };

  //save to local
  const saveLocalItems = () => {
    localStorage.setItem("items", JSON.stringify(itemList));
  };

  const getLocalItems = () => {
    if (localStorage.getItem("items") === null) {
      localStorage.setItem("items", JSON.stringify([]));
    } else {
      let todolocal = JSON.parse(localStorage.getItem("items"));
      setItemList(todolocal);
    }
  };

  return (
    <div className="App">
      <Navbar />
      <Routes>
        <Route path="/about" element={<About />} />
      </Routes>

      <header>
        <h1>Path To Freedom</h1>
      </header>

      <div className="gif-grid">
        {GIF.map((gif) => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
      </div>

      <div className={walletAddress ? "authed-container" : "container"}>
        {!walletAddress && renderNotConnectedContainer()}
        {walletAddress && renderConnectedContainer()}
      </div>
    </div>
  );
}

export default App;

// How to fetch all PDA existing accounts - need to update Anchor Program to have a "close account" instruction
// const list = await program.account.list.all();
// console.log("All list", list);

// const items = await program.account.dataAccount.all();
// console.log("All item", items);
