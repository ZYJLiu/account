import { useConnection, useWallet } from "@solana/wallet-adapter-react";

import {
  WalletConnectButton as ReactUIWalletConnectButton,
  WalletDisconnectButton as ReactUIWalletDisconnectButton,
  WalletModalButton as ReactUIWalletModalButton,
  WalletMultiButton as ReactUIWalletMultiButton,
} from "@solana/wallet-adapter-react-ui";

import {
  Keypair,
  SystemProgram,
  Transaction,
  TransactionSignature,
} from "@solana/web3.js";
import { FC, useCallback } from "react";

const About = ({ pubkey }) => {
  const { connection } = useConnection();
  const { publicKey, sendTransaction } = useWallet();

  console.log(pubkey);

  const Handler = useCallback(async () => {
    console.log(pubkey);
    // let signature: TransactionSignature = "";

    // const transaction = new Transaction().add(
    //   SystemProgram.transfer({
    //     fromPubkey: publicKey,
    //     toPubkey: Keypair.generate().publicKey,
    //     lamports: 1,
    //   })
    // );

    // // console.log(transaction);

    // signature = await sendTransaction(transaction, connection);

    // await connection.confirmTransaction(signature, "processed");
  }, [publicKey, connection, sendTransaction]);

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "90vh",
      }}
    >
      <button onClick={Handler} className="complete-btn">
        <i className="fas fa-smile"></i>
      </button>
    </div>
  );
};

export default About;
