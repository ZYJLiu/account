import React from 'react';
import Form from './Form'

//solana
import { Connection, PublicKey, clusterApiUrl} from '@solana/web3.js';
import {
  Program, Provider, web3
} from '@project-serum/anchor';

import idl from './idl.json';

import { Buffer } from 'buffer';
window.Buffer = Buffer;

const Item = ({itemText, setItemText, todos, setTodos, setStatus, list, setList, itemList, setItemList}) => {

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
        //   console.log(provider.wallet.publicKey.toString())
        //   console.log("ping")
          
    
          const name = list
        //   console.log(name)

          let listkey = todos.find(todo => {
              if (name ===  todo.text) return todo;
          } );

        //   console.log(listkey.id.toString())
          console.log(listkey)
          console.log(listkey.owner.toString())

        //   console.log(provider.wallet)

          const itemAccount = web3.Keypair.generate();
        //   console.log(itemAccount.publicKey.toString())

          await program.rpc.addItem(listkey.text, itemText, {
            accounts: {
              list: listkey.id,
              owner: listkey.owner,
              item: itemAccount.publicKey,
              user: provider.wallet.publicKey,
              systemProgram: SystemProgram.programId,
            },
            signers: [
            //   provider,

            
              itemAccount,
            ]
          });

          let item = await program.account.dataAccount.fetch(itemAccount.publicKey);
          console.log(item)
          console.log(item.amount)


          setItemList([
            ...itemList, {creator: item.creator, name: item.name, amount: item.amount, id:itemAccount.publicKey} //change ID to PDA
        ]);
        
        console.log(itemList)
    

        //   // console.log(listAccount.toString())
        //   console.log("Created a new BaseAccount w/ address:", listAccount.toString())
        //   let list = await program.account.list.fetch(listAccount);
        //   console.log(list.name)
        //   console.log(list.lines)
        //   // console.log(baseAccount.toString())
        //   // let account = await program.account.list.fetch(baseAccount);
        //   // console.log(account)
        // //   await getGifList();

        // setTodos([
        //     ...todos, {text: list.name, completed: false, id: listAccount, lines: list.lines } //change ID to PDA
        // ]);
      
        } catch(error) {
          console.log("Error creating BaseAccount account:", error)
        }


        setItemText("");

      }




    // const submitTodoHandler = (e) => {
    //     e.preventDefault();
    //     setTodos([
    //         ...todos, {text: itemText, completed: false, id: Math.random()*1000} //change ID to PDA
    //     ]);
    //     setitemText("");

    // };








    const inputTextHandler = (e) => {
        // console.log(e.target.value);
        setItemText(e.target.value);
    };


    const statusHandler = (e) => {
        setStatus(e.target.value);
        setList(e.target.value);
        console.log(e.target.value)
    };

    return(
        <form>
            <input 
                value={itemText} 
                onChange={inputTextHandler} 
                type="text" 
                className="todo-input" 
                placeholder="Create Line Item"
            />
            <button onClick={createAccount}className="todo-button" type="submit">
            <i className="fas fa-plus-square"></i>
            </button>
            <div className="select">
            <select onChange={statusHandler} name="todos" className="filter-todo">
                <option value="Select Account">  Select Account</option>
                {todos.map((todo) => <option key={todo.id}>{todo.text}</option>)}
            </select>
            </div>
      </form>
      
    )
}


export default Item;
