const anchor = require('@project-serum/anchor');
const BN = require('bn.js');
const expect = require('chai').expect;
const { SystemProgram, LAMPORTS_PER_SOL } = anchor.web3;


describe('Test', () => {

  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const mainProgram = anchor.workspace.Anchor;

  
  //"User" functions
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

  function programForUser(user) {
    return new anchor.Program(mainProgram.idl, mainProgram.programId, user.provider);
  }

  async function getAccountBalance(pubkey) {
    let account = await provider.connection.getAccountInfo(pubkey);
    return account?.lamports ?? 0;
  }

  //"List" function
  async function createList(owner, name, capacity=16) {
    const [listAccount, bump] = await anchor.web3.PublicKey.findProgramAddress([
      "list",
      owner.key.publicKey.toBytes(),
      name.slice(0, 32)
    ], mainProgram.programId);

    let program = programForUser(owner);
    await program.rpc.createList(name, capacity, bump, {
      accounts: {
        list: listAccount,
        user: owner.key.publicKey,
        systemProgram: SystemProgram.programId,
      },
    });

    let list = await program.account.list.fetch(listAccount);
    return { publicKey: listAccount, data: list };
  }

  //"Add Item" function
  async function addItem({list, user, name }) {
    const itemAccount = anchor.web3.Keypair.generate();
    let program = programForUser(user);
    await program.rpc.addItem(list.data.name, name, {
      accounts: {
        list: list.publicKey,
        owner: list.data.owner,
        item: itemAccount.publicKey,
        user: user.key.publicKey,
        systemProgram: SystemProgram.programId,
      },
      signers: [
        user.key,
        itemAccount,
      ]
    });

    let [listData, itemData] = await Promise.all([
      program.account.list.fetch(list.publicKey),
      program.account.dataAccount.fetch(itemAccount.publicKey),
    ]);

    return {
      list: {
        publicKey: list.publicKey,
        data: listData,
      },
      item: {
        publicKey: itemAccount.publicKey,
        data: itemData,
      }
    };
  }









  it('Create Data Account', async () => {
    // Add your test here.

    const owner = await createUser();
    const program = programForUser(owner);

    const revenue = await createList(owner, 'Revenue');
    const expense = await createList(owner, 'Cash');
    // let CashList = await createList(owner, 'Cash');
    // console.log(list)
    // console.log(ExpenseList)
    // console.log(CashList)

    const receiver = await createUser();

    const item1 = await addItem({list: revenue, user: owner, name: 'Coffee',});
    



    // const item2 = await addItem({list: expense, user: owner, name: 'Cash',});
    
    // console.log(revenue.data.name)

    // // const program2 = programForUser(receiver);
    
    
    
    const test = await program.rpc.pay(new anchor.BN(1), {
      accounts:{
        // list: revenue.publicKey,
        // owner: owner.key.publicKey,
        item1: item1.item.publicKey,
        receiver: receiver.key.publicKey,
        user: owner.key.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
    
    });
    

    



    const balance1 = await getAccountBalance(receiver.key.publicKey) / LAMPORTS_PER_SOL
    console.log(balance1);

    const balance3 = await getAccountBalance(owner.key.publicKey) / LAMPORTS_PER_SOL
    console.log(balance3);
    
    console.log(item1) //convert to number
    // console.log(item2)




    
    // const program = anchor.workspace.Anchor;

    // const [owner, payer, receiver] = await createUsers(3);


    // const item1 = anchor.web3.Keypair.generate();
    // const item2 = anchor.web3.Keypair.generate();
    // console.log(payer.key.publicKey.toString())
    
    // await program.rpc.create('Expense', {
    //   accounts:{
    //     item: item1.publicKey,
    //     user: owner.key.publicKey,
    //     systemProgram: anchor.web3.SystemProgram.programId,
    //   },
    //   signers: [item1]

    // });

    // await program.rpc.create('Accounts Payable', {
    //   accounts:{
    //     item: item2.publicKey,
    //     user: owner.key.publicKey,
    //     systemProgram: anchor.web3.SystemProgram.programId,
    //   },
    //   signers: [item2]

    // });


    // await program2.rpc.receive(new anchor.BN(1), {
    //   accounts:{
    //     // item1: item1.publicKey,
    //     // item2: item2.publicKey,
    //     payer: payer.key.publicKey,
    //     systemProgram: anchor.web3.SystemProgram.programId,
    //     user: owner.key.publicKey,
    //   },
    // });

  
    
    // const Coffee = await program.account.dataAccount.fetch(item1.publicKey);
    // console.log(Coffee.amount);

    // const Cash = await program.account.dataAccount.fetch(item2.publicKey);
    // console.log(Cash.amount);
    
    // const balance = await getAccountBalance(payer.key.publicKey) / LAMPORTS_PER_SOL
    // console.log(balance);





  });
});
