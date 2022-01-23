const anchor = require('@project-serum/anchor');
const BN = require('bn.js');
const expect = require('chai').expect;
const { SystemProgram, LAMPORTS_PER_SOL } = anchor.web3;


describe('Test', () => {

  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const mainProgram = anchor.workspace.Anchor;

  async function createUser(airdropBalance) {
    airdropBalance = airdropBalance ?? 3 * LAMPORTS_PER_SOL;
    let user = anchor.web3.Keypair.generate();
    let sig = await provider.connection.requestAirdrop(user.publicKey, airdropBalance);
    await provider.connection.confirmTransaction(sig);

    let wallet = new anchor.Wallet(user);
    let userProvider = new anchor.Provider(provider.connection, wallet, provider.opts);

    return {
      key: user,
      wallet,
      provider: userProvider,
    };
  }

  function createUsers(numUsers) {
    let promises = [];
    for(let i = 0; i < numUsers; i++) {
      promises.push(createUser());
    }

    return Promise.all(promises);
  }

  async function getAccountBalance(pubkey) {
    let account = await provider.connection.getAccountInfo(pubkey);
    return account?.lamports ?? 0;
  }

  function programForUser(user) {
    return new anchor.Program(mainProgram.idl, mainProgram.programId, user.provider);
  }









  it('Create Data Account', async () => {
    // Add your test here.
    const item1 = anchor.web3.Keypair.generate();
    const item2 = anchor.web3.Keypair.generate();

    // const program = anchor.workspace.Anchor;

    const [owner, payer, receiver] = await createUsers(3);
    const program = programForUser(owner);
    const program2 = programForUser(payer);

  
    console.log(payer.key.publicKey.toString())
    
    await program.rpc.create('Expense', {
      accounts:{
        item: item1.publicKey,
        user: owner.key.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [item1]

    });

    await program.rpc.create('Accounts Payable', {
      accounts:{
        item: item2.publicKey,
        user: owner.key.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
      signers: [item2]

    });

    await program.rpc.pay(new anchor.BN(1), {
      accounts:{
        item1: item1.publicKey,
        item2: item2.publicKey,
        receiver: receiver.key.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        user: owner.key.publicKey,
      },

    });

    await program2.rpc.receive(new anchor.BN(1), {
      accounts:{
        // item1: item1.publicKey,
        // item2: item2.publicKey,
        payer: payer.key.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
        user: owner.key.publicKey,
      },
    });

  
    
    const Coffee = await program.account.dataAccount.fetch(item1.publicKey);
    console.log(Coffee.amount);

    const Cash = await program.account.dataAccount.fetch(item2.publicKey);
    console.log(Cash.amount);
    
    const balance = await getAccountBalance(payer.key.publicKey) / LAMPORTS_PER_SOL
    console.log(balance);

    const balance1 = await getAccountBalance(receiver.key.publicKey) / LAMPORTS_PER_SOL
    console.log(balance1);

    const balance3 = await getAccountBalance(owner.key.publicKey) / LAMPORTS_PER_SOL
    console.log(balance3);




  });
});
