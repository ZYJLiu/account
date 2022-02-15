// import React from "react";
// import {
//   Connection,
//   PublicKey,
//   clusterApiUrl,
//   LAMPORTS_PER_SOL,
// } from "@solana/web3.js";
// import { Program, Provider, web3 } from "@project-serum/anchor";
// import idl from "./idl.json";

// const Calculation = (calculate, setCalculate) => {
//   //SOLANA
//   // SystemProgram is a reference to the Solana runtime!
//   const { SystemProgram, Keypair } = web3;

//   // Array to hold list of ListAccount pubkeys.

//   // Get our program's id from the IDL file.
//   const programID = new PublicKey(idl.metadata.address);

//   // Set our network to devnet.
//   const network = clusterApiUrl("devnet");

//   // Controls how we want to acknowledge when a transaction is "done".
//   const opts = {
//     preflightCommitment: "processed",
//   };

//   const getProvider = () => {
//     const connection = new Connection(network, opts.preflightCommitment);
//     const provider = new Provider(
//       connection,
//       window.solana,
//       opts.preflightCommitment
//     );
//     return provider;
//   };

//   const test = async (e) => {
//     const provider = getProvider();
//     const program = new Program(idl, programID, provider);

//     const pub = "84gwQnfpN5QKzoP1ArS8gPdegNTshyhE3hVquCJAC1nA";
//     const pub2 = "J7U25ESC5ahUrYYdoHJvjv2BvCuKA9WitwZ5cgJ1CAhD";

//     const item1 = await program.account.dataAccount.fetch(pub);
//     const item2 = await program.account.dataAccount.fetch(pub2);

//     setCalculate(item1.amount.toString());
//   };

//   const amount = calculate;

//   return (
//     <div className="todo-container">
//       <div className="todo">
//         <ul className="todo-item">Test Calculation: {test}</ul>
//         <ul className="todo-item">{amount}</ul>
//       </div>
//     </div>
//   );
// };

// export default Calculation;
