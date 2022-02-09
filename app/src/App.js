//react
import React, { useState, useEffect } from "react";
import "./App.css";

//import components
import Form from "./components/Form";
import TodoList from "./components/TodoList";
import Item from "./components/Item";
import ItemList from "./components/ItemList";
import Pay from "./components/Pay";

//navbar
import Navbar from "./components/Navbar/Navbar.component";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/";
import About from "./pages/about";

//GIF
const GIF = ["https://media.giphy.com/media/d4jBk4fb84sTyRmtxt/giphy.gif"];

function App() {
  //state
  const [inputText, setInputText] = useState("");
  const [itemText, setItemText] = useState("");
  const [todos, setTodos] = useState([]);
  const [status, setStatus] = useState("all");
  const [filteredTodos, setFilteredTodos] = useState([]);
  const [list, setList] = useState("");
  const [itemList, setItemList] = useState([]);
  const [itemStatus, setItemStatus] = useState("");
  const [filteredItems, setFilteredItems] = useState([]);

  //wallet
  const [walletAddress, setWalletAddress] = useState(null);

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
      <Pay />
      <Form
        todos={todos}
        setTodos={setTodos}
        inputText={inputText}
        setInputText={setInputText}
        setStatus={setStatus}
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
    switch (status) {
      case "completed":
        setFilteredTodos(todos.filter((todo) => todo.completed == true));
        break;
      case "uncompleted":
        setFilteredTodos(todos.filter((todo) => todo.completed == false));
        break;
      default:
        setFilteredTodos(todos);
        break;
    }
  };

  useEffect(() => {
    itemfilterHandler();
    // saveLocalTodos();
    console.log(itemStatus);
  }, [itemStatus, itemList]);

  const itemfilterHandler = () => {
    if (itemStatus == "All") {
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
