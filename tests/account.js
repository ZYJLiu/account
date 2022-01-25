const anchor = require('@project-serum/anchor');
const BN = require('bn.js');
const expect = require('chai').expect;
const { SystemProgram, LAMPORTS_PER_SOL } = anchor.web3;


describe('Begin Test', () => {

  const provider = anchor.Provider.env();
  anchor.setProvider(provider);
  const mainProgram = anchor.workspace.Anchor;

  
  //"User" functions
  async function createUser(airdropBalance) {
    airdropBalance = airdropBalance ?? 5 * LAMPORTS_PER_SOL;
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




///TEST STARTS HERE
///TEST STARTS HERE
///TEST STARTS HERE




  it('Create Data Account', async () => {
    // Add your test here.

    const [owner, receiver, payer] = await createUsers(3);
    
    const program = programForUser(owner);
    const program2 = programForUser(payer);

    // Create Revenue and Asset Lists and Add items
    console.log('Created Revenue & Added Two Line Items')    
    const revenue = await createList(owner, 'Revenue');
    const coffee = await addItem({list: revenue, user: owner, name: 'Coffee',});
    const beer = await addItem({list: revenue, user: owner, name: 'Beer',});

    let revenue_items = await program.account.list.fetch(revenue.publicKey)
    // console.log(revenue_items) 

    const expense = await createList(owner, 'Expense');
    const service = await addItem({list: expense, user: owner, name: 'Service Expense',});
    let expense_items = await program.account.list.fetch(expense.publicKey)
    // console.log(expense_items) 

    const asset = await createList(owner, 'Asset');
    const cash = await addItem({list: asset, user: owner, name: 'Cash',});
    let asset_items = await program.account.list.fetch(asset.publicKey)
    // console.log(asset_items) 




    //Receive - Payer sends SOL to User
    const receive = await program2.rpc.receive(new anchor.BN(3), {
      accounts:{
        item1: cash.item.publicKey,
        item2: coffee.item.publicKey,
        payer: payer.key.publicKey,
        user: owner.key.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
        signers: [payer.key]

    });

    // let test2 = await program.account.dataAccount.fetch(service.item.publicKey)
    // console.log(test2)

    let test1 = await program.account.dataAccount.fetch(cash.item.publicKey)
    console.log(test1)

    let test2 = await program.account.dataAccount.fetch(coffee.item.publicKey)
    console.log(test2)


    const balance3 = await getAccountBalance(payer.key.publicKey) / LAMPORTS_PER_SOL
    console.log("Payer Ending SOL Balance")
    console.log(balance3);

    const balance4 = await getAccountBalance(owner.key.publicKey) / LAMPORTS_PER_SOL
    console.log("Owner Ending SOL Balance")
    console.log(balance4);



    // Payment - User sends SOL to Receiver
    const pay = await program.rpc.pay(new anchor.BN(1), {
      accounts:{
        item1: cash.item.publicKey,
        item2: service.item.publicKey,
        receiver: receiver.key.publicKey,
        user: owner.key.publicKey,
        systemProgram: anchor.web3.SystemProgram.programId,
      },
        signers: [owner.key]

    });
    
    let test3 = await program.account.dataAccount.fetch(service.item.publicKey)
    console.log(test3)

    let test4 = await program.account.dataAccount.fetch(cash.item.publicKey)
    console.log(test4)


    const balance1 = await getAccountBalance(receiver.key.publicKey) / LAMPORTS_PER_SOL
    console.log("Receiver Ending SOL Balance")
    console.log(balance1);

    const balance5 = await getAccountBalance(owner.key.publicKey) / LAMPORTS_PER_SOL
    console.log("Owner Ending SOL Balance")
    console.log(balance5);
    




        // // const program2 = programForUser(receiver);

    
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
