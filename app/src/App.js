import React, { useEffect, useState } from 'react';
import twitterLogo from './assets/github.svg';
import './App.css';
import { Connection, PublicKey, clusterApiUrl} from '@solana/web3.js';
import {
  Program, Provider, web3
} from '@project-serum/anchor';

import idl from './idl.json';

import * as anchor from "@project-serum/anchor";
import { Buffer } from 'buffer';
window.Buffer = Buffer;

// SystemProgram is a reference to the Solana runtime!
const { SystemProgram, Keypair } = web3;

// Create a keypair for the account that will hold the GIF data.
let baseAccount = [];

// Get our program's id from the IDL file.
const programID = new PublicKey(idl.metadata.address);

// Set our network to devnet.
const network = clusterApiUrl('devnet');

// Controls how we want to acknowledge when a transaction is "done".
const opts = {
  preflightCommitment: "processed"
}

// Constants
const TWITTER_HANDLE = 'ZYJLiu';
const TWITTER_LINK = `https://github.com/${TWITTER_HANDLE}`;

const TEST_GIFS = [
	'https://media.giphy.com/media/d4jBk4fb84sTyRmtxt/giphy.gif',
]


const App = () => {

  const [walletAddress, setWalletAddress] = useState(null);
  const [inputValue, setInputValue] = useState('');
  const [gifList, setGifList] = useState([]);

  const [nameValue, setNameValue] = useState([]);
  
  // Actions
  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;

      if (solana) {
        if (solana.isPhantom) {
          console.log('Phantom wallet found!');
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            'Connected with Public Key:',
            response.publicKey.toString()
          );
          /*
           * Set the user's publicKey in state to be used later!
           */
          setWalletAddress(response.publicKey.toString());
        }
      } else {
        alert('Solana object not found! Get a Phantom Wallet 👻');
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
      console.log('Connected with Public Key:', response.publicKey.toString());
      setWalletAddress(response.publicKey.toString());
    }
  };

  const sendGif = async () => {
    if (inputValue.length > 0) {
      console.log('Gif link:', inputValue);
      setGifList([...gifList, inputValue]);
      setInputValue('');
    } else {
      console.log('Empty input. Try again.');
    }
  };

  const onInputChange = (event) => {
    const { value } = event.target;
    setInputValue(value);
  };

  const onNameChange = (event) => {
    const { value } = event.target;
    setNameValue(value);
  };

  const getProvider = () => {
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new Provider(
      connection, window.solana, opts.preflightCommitment,
    );
    return provider;
  }


  //RETURN HERE
  //WORK ON DISPLAYING INPUTS
  const createGifAccount = async () => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      console.log(provider.wallet.publicKey.toString())
      console.log("ping")
      

      const name = nameValue
      const capacity = 16
      const [listAccount, bump] = await web3.PublicKey.findProgramAddress([
        "list",
        provider.wallet.publicKey.toBytes(),
        name.slice(0, 32)
      ], program.programId);

      // console.log(listAccount.toString())
      // console.log("Created a new BaseAccount w/ address:", listAccount.toString())
  
      await program.rpc.createList(name, capacity, bump,{
        accounts: {
          list: listAccount, //
          user: provider.wallet.publicKey,
          systemProgram: SystemProgram.programId,
        },
        // signers: [baseAccount]
      });

      baseAccount.push(listAccount)
      // console.log(listAccount.toString())
      console.log("Created a new BaseAccount w/ address:", listAccount.toString())
      let list = await program.account.list.fetch(listAccount);
      console.log(list)
      // console.log(baseAccount.toString())
      // let account = await program.account.list.fetch(baseAccount);
      // console.log(account)
      await getGifList();
  
    } catch(error) {
      console.log("Error creating BaseAccount account:", error)
    }
  }

  /*
   * We want to render this UI when the user hasn't connected
   * their wallet to our app yet.
   */
  const renderNotConnectedContainer = () => (
    <div className="connected-container">
      <div className="gif-grid">
        {TEST_GIFS.map(gif => (
          <div className="gif-item" key={gif}>
            <img src={gif} alt={gif} />
          </div>
        ))}
            <button
              className="cta-button connect-wallet-button"
              onClick={connectWallet}
            >
              Connect to Wallet
            </button>
      </div>
    </div>
  );

  const renderConnectedContainer = () => {
    // If we hit this, it means the program account hasn't been initialized.
      // if (gifList != null) {
        return (
          <div className="connected-container">
             <form
              onSubmit={(event) => {
                event.preventDefault();
                setNameValue('');
              }}
            >
              <input
                  type="text"
                  placeholder="Account Name"
                  value={nameValue}
                  onChange={onNameChange}
                />
              <button className="cta-button submit-gif-button" onClick={createGifAccount}>
                Account
              </button>
            </form>

    

            <form
              onSubmit={(event) => {
                event.preventDefault();
                sendGif();
              }}
            >
              <input
                type="text"
                placeholder="Line Item"
                value={inputValue}
                onChange={onInputChange}
              />
              <button type="submit" className="cta-button submit-gif-button">
                Item
              </button>
            </form>
            <div className="gif-grid">
              {/* We use index as the key instead, also, the src is now item.gifLink */}
              {/* {gifList.map((item, index) => (
                <div className="gif-item" key={index}>
                  <li key={item}>{item}</li>
                  <img src={item.gifLink} />
                </div> */}
              {/* ))} */}
            </div>

          </div>
          
        )
      // } 
      // Otherwise, we're good! Account exists. User can submit GIFs.
      // else {
      //   return(
      //     <div className="connected-container">
      //       <form
      //         onSubmit={(event) => {
      //           event.preventDefault();
      //           sendGif();
      //         }}
      //       >
      //         <input
      //           type="text"
      //           placeholder="Enter gif link!"
      //           value={inputValue}
      //           onChange={onInputChange}
      //         />
      //         <button type="submit" className="cta-button submit-gif-button">
      //           Submit
      //         </button>
      //       </form>
      //       <div className="gif-grid">
      //         {/* We use index as the key instead, also, the src is now item.gifLink */}
      //         {gifList.map((item, index) => (
      //           <div className="gif-item" key={index}>
      //             <img src={item.gifLink} />
      //           </div>
      //         ))}
      //       </div>
      //     </div>
      //   )
      // }
    }

  // UseEffects
  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener('load', onLoad);
    return () => window.removeEventListener('load', onLoad);
  }, []);













  const getGifList = async() => {
    try {
      const provider = getProvider();
      const program = new Program(idl, programID, provider);
      // let baseAccount = baseAccount
      const account = await program.account.list.fetch(baseAccount.toString());
      
      console.log(account)
      // console.log("Got the account", account)
      setGifList(account)
  
    } catch (error) {
      console.log("Error in getGifList: ", error)
      setGifList(null);
    }
  }
  
  useEffect(() => {
    if (walletAddress) {
      console.log('Fetching GIF list...');
      getGifList()
    }
  }, [walletAddress]);

  return (
    <div className="App">
            {/* This was solely added for some styling fanciness */}
            <div className={walletAddress ? 'authed-container' : 'container'}>
        <div className="header-container">
          <p className="header">Building the Path to Freedom</p>
          <p className="sub-text">
          🚀 This is the way ✨
          </p>
          {/* Add the condition to show this only if we don't have a wallet address */}
          {!walletAddress && renderNotConnectedContainer()}
          {/* We just need to add the inverse here! */}
          {walletAddress && renderConnectedContainer()} 
        </div>
        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`🤪${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

export default App;