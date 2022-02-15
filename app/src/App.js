//react
import React, { useState, useEffect } from "react";
import "./App.css";

//import components
import Form from "./components/CreateList";
import TodoList from "./components/AccountList";
import Item from "./components/CreateItem";
import ItemList from "./components/ItemList";
import Pay from "./components/Pay";
import Calculation from "./components/Calculation";
import AccountItemTable from "./components/AccountItemTable";

//navbar
import Navbar from "./components/Navbar/Navbar.component";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import About from "./pages/about";

//GIF
const GIF = ["https://media.giphy.com/media/d4jBk4fb84sTyRmtxt/giphy.gif"];

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
  const [calculate, setCalculate] = useState("");

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

  /*
   * Let's define this method so our code doesn't break.
   * We will write the logic for this next!
   */
  const connectWallet = async () => {
    const { solana } = window;

    if (solana) {
      const response = await solana.connect();
      console.log("Connected with Public Key:", response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
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
      <Pay
        receiver={receiver}
        setReceiver={setReceiver}
        filteredItems={filteredItems}
        setFilteredItems={setFilteredItems}
        itemList={itemList}
        setItemList={setItemList}
      />
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
      />
      <TodoList
        setTodos={setTodos}
        todos={todos}
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
      />
      <ItemList
        itemList={itemList}
        setItemList={setItemList}
        filteredItems={filteredItems}
        setFilteredItems={setFilteredItems}
        list={list}
        todos={todos}
      />
      <AccountItemTable todos={todos} itemList={itemList} />
      {/* <Calculation calculate={calculate} setCalculate={setCalculate} /> */}
    </div>
  );

  /*
   * When our component first mounts, let's check to see if we have a connected
   * Phantom Wallet
   */
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
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
      setFilteredTodos(todos.filter((todo) => todo.text == name));
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
        if (name === todo.text) return todo;
      });

      console.log(listkey);

      setFilteredItems(itemList.filter((item) => item.list == listkey.id));

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
