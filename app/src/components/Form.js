import React from 'react';

//solana
import { Connection, PublicKey, clusterApiUrl} from '@solana/web3.js';
import {
  Program, Provider, web3
} from '@project-serum/anchor';

import idl from './idl.json';

import { Buffer } from 'buffer';
window.Buffer = Buffer;


const Form = ({inputText, setInputText, todos, setTodos, setStatus}) => {

        //SOLANA
    // SystemProgram is a reference to the Solana runtime!
    const { SystemProgram, Keypair } = web3;

    // Array to hold list of ListAccount pubkeys.

    // Get our program's id from the IDL file.
    const programID = new PublicKey(idl.metadata.address);

    // Set our network to devnet.
    const network = clusterApiUrl('devnet');

    // Controls how we want to acknowledge when a transaction is "done".
    const opts = {
    preflightCommitment: "processed"
    }

    const getProvider = () => {
        const connection = new Connection(network, opts.preflightCommitment);
        const provider = new Provider(
          connection, window.solana, opts.preflightCommitment,
        );
        return provider;
      }

    const createAccount = async (e) => {
        e.preventDefault();

        try {
          const provider = getProvider();
          const program = new Program(idl, programID, provider);
          // console.log(provider.wallet.publicKey.toString())
          // console.log("ping")
          
    
          const name = inputText
          const capacity = 16
          const [listAccount, bump] = await web3.PublicKey.findProgramAddress([
            "list",
            provider.wallet.publicKey.toBytes(),
            name.slice(0, 32)
          ], program.programId);
    
          // console.log(listAccount.toString())
          // console.log("Created a new Account w/ address:", listAccount.toString())
      
          await program.rpc.createList(name, capacity, bump,{
            accounts: {
              list: listAccount, //
              user: provider.wallet.publicKey,
              systemProgram: SystemProgram.programId,
            },
            // signers: [baseAccount]
          });
   
          // console.log(listAccount.toString())
          // console.log("Created a new BaseAccount w/ address:", listAccount.toString())
          let list = await program.account.list.fetch(listAccount);
          // console.log(list.name)
          // console.log(list.owner)
          // console.log(baseAccount.toString())
          // let account = await program.account.list.fetch(baseAccount);
          // console.log(account)
        //   await getGifList();

        setTodos([
            ...todos, {text: list.name, id: listAccount, owner: list.owner, lines: list.lines, completed: false, } //change ID to PDA
        ]);

      
      
        } catch(error) {
          console.log("Error creating BaseAccount account:", error)
        }

        setInputText("");
      }
    

    





    // const submitTodoHandler = (e) => {
    //     e.preventDefault();
    //     setTodos([
    //         ...todos, {text: inputText, completed: false, id: Math.random()*1000} //change ID to PDA
    //     ]);
    //     setInputText("");

    // };












    const inputTextHandler = (e) => {
        // console.log(e.target.value);
        setInputText(e.target.value);
    };


    const statusHandler = (e) => {
        setStatus(e.target.value);
        console.log(e.target.value)
    };

    return(
        <form>
            <input 
                value={inputText} 
                onChange={inputTextHandler} 
                type="text" 
                className="todo-input" 
                placeholder="Create Account"
            />
            <button onClick={createAccount}className="todo-button" type="submit">
            <i className="fas fa-plus-square"></i>
            </button>
            <div className="select">
            <select onChange={statusHandler} name="todos" className="filter-todo">
                <option value="all">All</option>
                <option value="completed">Complete</option>
                <option value="uncompleted">Uncomplete</option>
            </select>
            </div>
      </form>
      
    )
}

export default Form;
