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
    airdropBalance = airdropBalance ?? 2 * LAMPORTS_PER_SOL;
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




  it('Create Accounts', async () => {
    // Add your test here.

    const owner = await createUser();
    
    const program = programForUser(owner);

    const revenue = await createList(owner, 'Revenue');
    const coffee = await addItem({list: revenue, user: owner, name: 'Coffee',});
    const beer = await addItem({list: revenue, user: owner, name: 'Beer',});

    let revenue_items = await program.account.list.fetch(revenue.publicKey)
    console.log(revenue_items) 

    const expense = await createList(owner, 'Asset');
    const service = await addItem({list: expense, user: owner, name: 'Cash',});
    let expense_items = await program.account.list.fetch(expense.publicKey)
    console.log(expense_items) 

  });


  it('Revenue - Receive Payment', async () => {
    // Add your test here.

    const [owner, payer] = await createUsers(2);
    
    const program = programForUser(owner);
    const program2 = programForUser(payer);

    // Create Revenue and Asset Lists and Add items
    const revenue = await createList(owner, 'Revenue');
    const coffee = await addItem({list: revenue, user: owner, name: 'Coffee',});

    const asset = await createList(owner, 'Asset');
    const cash = await addItem({list: asset, user: owner, name: 'Cash',});

    const balance7 = await getAccountBalance(payer.key.publicKey) / LAMPORTS_PER_SOL
    console.log("Payer Beginning Balance")
    console.log(balance7);

    const balance8 = await getAccountBalance(owner.key.publicKey) / LAMPORTS_PER_SOL
    console.log("Owner Beginning Balance")
    console.log(balance8);


    //Receive - Payer sends SOL to User
    const receive = await program2.rpc.receive(new anchor.BN(1), {
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
    console.log("Payer Ending Balance")
    console.log(balance3);

    const balance4 = await getAccountBalance(owner.key.publicKey) / LAMPORTS_PER_SOL
    console.log("Owner Ending Balance")
    console.log(balance4);


    _owner = owner
    _cash = cash

  });

  it('Expense - Send Payment', async () => {
    // Add your test here.

    const owner = _owner
    const receiver = await createUser();
    
    const program = programForUser(owner);
    
    const cash = _cash
    const expense = await createList(owner, 'Expense');
    const service = await addItem({list: expense, user: owner, name: 'Service Expense',});

    // const asset = await createList(owner, 'Asset');
    // const cash = await addItem({list: asset, user: owner, name: 'Cash',});

    const balance9 = await getAccountBalance(receiver.key.publicKey) / LAMPORTS_PER_SOL
    console.log("Receiver Beginning Balance")
    console.log(balance9);

    const balance10 = await getAccountBalance(owner.key.publicKey) / LAMPORTS_PER_SOL
    console.log("Owner Beginning Balance")
    console.log(balance10);



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
    console.log("Receiver Ending Balance")
    console.log(balance1);

    const balance5 = await getAccountBalance(owner.key.publicKey) / LAMPORTS_PER_SOL
    console.log("Owner Ending Balance")
    console.log(balance5);

  });
});
