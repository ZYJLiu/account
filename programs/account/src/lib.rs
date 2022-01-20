use anchor_lang::prelude::*;
// use anchor_lang::AccountsClose;

declare_id!("4kiCL5ZnfTViX7WddCYvGMowULgkJNrnAAWRoz3JVT7e");

#[program]
pub mod todo {
    // use anchor_lang::solana_program::{program::invoke, system_instruction::transfer};

    use super::*;
    pub fn new_list(
        ctx: Context<NewList>, 
        name: String, //pass in name
        capacity: u16, //pass in capacity
        account_bump: u8, //not sure what a bump is 
    ) -> ProgramResult {
        // Create a new account
        let list = &mut ctx.accounts.list; // mutable instance of "NewList" struct and assign to variable "list"
        list.list_owner = *ctx.accounts.user.to_account_info().key; //1) set list_owner
        list.bump = account_bump; //2) set bump
        list.name = name; //3) set name
        list.capacity = capacity; //4) set capacity
        Ok(())
    }

    pub fn add(
        ctx: Context<Add>,
        _list_name: String, //pass in list name, to know which list to add item to?
        item_name: String, // pass in item name
        // bounty: u64, // pass in bounty amount
    ) -> ProgramResult {
        let user = &ctx.accounts.user; //signer
        let list = &mut ctx.accounts.list; //mutable instance of "NewList" struct and assign to variable "list"
        let item = &mut ctx.accounts.item; //mutable instance of "ListItem" struct and assign to variable "item"

        if list.lines.len() >= list.capacity as usize { //check list length of list
            return Err(TodoListError::ListFull.into());
        }

        list.lines.push(*item.to_account_info().key); // put item on list
        item.name = item_name; //name item
        item.creator = *user.to_account_info().key; //set item creator as user (who called this add function, creating this item)

        // let amount = bounty;
        // item.amount +=amount;

        // Move the bounty to the account. We account for the rent amount that Anchor's init
        // already transferred into the account.
        // let account_lamports = **item.to_account_info().lamports.borrow(); //lamports in item account (from rent)
        // let transfer_amount = bounty //bounty amount
        //     .checked_sub(account_lamports)
        //     .ok_or(TodoListError::BountyTooSmall)?; //subtract out "rent" amount already in account from "bounty" amount

        // if transfer_amount > 0 {
        //     invoke( 
        //         &transfer( 
        //             user.to_account_info().key, //from creator of item
        //             item.to_account_info().key, //to item account
        //             transfer_amount, //bounty amount to be transferred
        //         ),
        //         &[ //specify which accounts transfer will interact with
        //             user.to_account_info(), // creator (user) account
        //             item.to_account_info(), // item account (created by user)
        //             ctx.accounts.system_program.to_account_info(), //system program
        //         ],
        //     )?;
        // }

        Ok(())
    }

    
    pub fn finish(
        ctx: Context<Finish>, 
        _list_name: String, 
        amount: i64,
    ) -> ProgramResult {
        let item = &mut ctx.accounts.item;
        let list = &mut ctx.accounts.list;
        let user = ctx.accounts.user.to_account_info().key;


        // if !list.lines.contains(item.to_account_info().key) {
        //     return Err(TodoListError::ItemNotFound.into());
        // }

        let is_item_creator = &item.creator == user;
        // let is_list_owner = &list.list_owner == user;

        // if !is_item_creator && !is_list_owner {
        //     return Err(TodoListError::FinishPermissions.into());
        // }
        


        if is_item_creator {
            item.amount += amount;
        }

        // if is_list_owner {
        //     item.list_owner_finished = true;
        // }

        // if item.creator_finished && item.list_owner_finished {
        //     let item_key = item.to_account_info().key;
        //     list.lines.retain(|key| key != item_key);
        //     item.close(ctx.accounts.list_owner.to_account_info())?;
        // }

        Ok(())
    }
}

#[derive(Accounts)]
#[instruction(list_name: String, amount: i64)] 
pub struct Finish<'info> {
    #[account(mut, has_one=list_owner @ TodoListError::WrongListOwner, seeds=[b"todolist", list_owner.to_account_info().key.as_ref(), name_seed(&list_name)], bump=list.bump)]
    pub list: Account<'info, TodoList>, //access list
    #[account(mut)]
    pub list_owner: AccountInfo<'info>, //list owner
    #[account(mut)]
    pub item: Account<'info, ListItem>, //access item
    pub user: Signer<'info>, //sign by user
}

#[derive(Accounts)]
#[instruction(list_name: String, item_name: String)]//, bounty: u64
pub struct Add<'info> {
    #[account(mut, has_one=list_owner @ TodoListError::WrongListOwner, seeds=[b"todolist", list_owner.to_account_info().key.as_ref(), name_seed(&list_name)], bump=list.bump)]
    pub list: Account<'info, TodoList>, //reference existing ToDoList account
    pub list_owner: AccountInfo<'info>, //check owned by list_owner
    // 8 byte discriminator,
    #[account(init, payer=user, space=ListItem::space(&item_name))]
    pub item: Account<'info, ListItem>, //create instance of ListItem
    pub user: Signer<'info>, // signed by user
    pub system_program: Program<'info, System>, // boilerplate
}


#[account]
pub struct ListItem {
    pub creator: Pubkey, //user who created item
    pub name: String, //item name
    pub amount: i64, // figure out where this goes
    // pub creator_finished: bool,
    // pub list_owner_finished: bool,
}

impl ListItem {
    fn space(name: &str) -> usize {
        // discriminator + creator pubkey + amount + name string
        200 + 8 + 32 + 8 + 4 + name.len() // added 100, come back and redo size after changes
    }
}


#[derive(Accounts)]
#[instruction(name: String, capacity: u16, list_bump: u8)]
pub struct NewList<'info> {
    #[account(init, //initiate instance of "TodoList" account
        payer=user, // set user as payer
        space=TodoList::space(&name, capacity), //set space
        seeds=[ //what is seed?
            b"todolist", //not sure what this is
            user.to_account_info().key.as_ref(), //user the "user" key as reference
            name_seed(&name) //pass in "name" from call of new_list function? or is it passing in b"todolist"?
        ],
        bump=list_bump)]
    pub list: Account<'info, TodoList>, //list = instance of "TodoList" account
    pub user: Signer<'info>,// user = signer/ payer of initiation of new instance of "TodoList" account
    pub system_program: Program<'info, System>, //boilerplate when init
}

#[account]
pub struct TodoList {
    pub list_owner: Pubkey, //1) owner is pubkey of "user" who created list
    pub bump: u8, //2) not sure what this is
    pub name: String, //4) name of list "Revenue"
    pub capacity: u16, //3) number of line items "Revenue" can hold
    pub lines: Vec<Pubkey>, //list of "Revenue" items
}

impl TodoList {
    fn space(name: &str, capacity: u16) -> usize {
        // discriminator + owner pubkey + bump + capacity
        8 + 32 + 1 + 2 +
            // name string
            4 + name.len() +
            // vec of item pubkeys
            200 + (capacity as usize) * std::mem::size_of::<Pubkey>() // added 100 
    }
}

fn name_seed(name: &str) -> &[u8] { //name_seed takes in "name"
    let b = name.as_bytes(); // b = "name" as bytes
    if b.len() > 32 { // set b length to 32 bytes if > 32
        &b[0..32]
    } else { //otherwise leave as is
        b 
    }
}


#[error]
pub enum TodoListError {
    #[msg("This list is full")]
    ListFull,
    #[msg("Bounty must be enough to mark account rent-exempt")]
    BountyTooSmall,
    #[msg("Only the list owner or item creator may cancel an item")]
    CancelPermissions,
    #[msg("Only the list owner or item creator may finish an item")]
    FinishPermissions,
    #[msg("Item does not belong to this todo list")]
    ItemNotFound,
    #[msg("Specified list owner does not match the pubkey in the list")]
    WrongListOwner,
    #[msg("Specified item creator does not match the pubkey in the item")]
    WrongItemCreator,
}


    // pub fn cancel(ctx: Context<Cancel>, _list_name: String) -> ProgramResult {
    //     let list = &mut ctx.accounts.list;
    //     let item = &mut ctx.accounts.item;
    //     let item_creator = &ctx.accounts.item_creator;

    //     let user = ctx.accounts.user.to_account_info().key;

    //     if &list.list_owner != user && &item.creator != user {
    //         return Err(TodoListError::CancelPermissions.into());
    //     }

    //     if !list.lines.contains(item.to_account_info().key) {
    //         return Err(TodoListError::ItemNotFound.into());
    //     }

    //     // Return the tokens to the item creator
    //     item.close(item_creator.to_account_info())?;

    //     let item_key = ctx.accounts.item.to_account_info().key;
    //     list.lines.retain(|key| key != item_key);

    //     Ok(())
    // }

    // pub fn finish(ctx: Context<Finish>, _list_name: String) -> ProgramResult {
    //     let item = &mut ctx.accounts.item;
    //     let list = &mut ctx.accounts.list;
    //     let user = ctx.accounts.user.to_account_info().key;

    //     if !list.lines.contains(item.to_account_info().key) {
    //         return Err(TodoListError::ItemNotFound.into());
    //     }

    //     let is_item_creator = &item.creator == user;
    //     let is_list_owner = &list.list_owner == user;

    //     if !is_item_creator && !is_list_owner {
    //         return Err(TodoListError::FinishPermissions.into());
    //     }

    //     if is_item_creator {
    //         item.creator_finished = true;
    //     }

    //     if is_list_owner {
    //         item.list_owner_finished = true;
    //     }

    //     if item.creator_finished && item.list_owner_finished {
    //         let item_key = item.to_account_info().key;
    //         list.lines.retain(|key| key != item_key);
    //         item.close(ctx.accounts.list_owner.to_account_info())?;
    //     }

    //     Ok(())
    // }

// #[derive(Accounts)]
// #[instruction(list_name: String)]
// pub struct Cancel<'info> {
//     #[account(mut, has_one=list_owner @ TodoListError::WrongListOwner, seeds=[b"todolist", list_owner.to_account_info().key.as_ref(), name_seed(&list_name)], bump=list.bump)]
//     pub list: Account<'info, TodoList>,
//     pub list_owner: AccountInfo<'info>,
//     #[account(mut)]
//     pub item: Account<'info, ListItem>,
//     #[account(mut, address=item.creator @ TodoListError::WrongItemCreator)]
//     pub item_creator: AccountInfo<'info>,
//     pub user: Signer<'info>,
// }

// #[derive(Accounts)]
// #[instruction(list_name: String)]
// pub struct Finish<'info> {
//     #[account(mut, has_one=list_owner @ TodoListError::WrongListOwner, seeds=[b"todolist", list_owner.to_account_info().key.as_ref(), name_seed(&list_name)], bump=list.bump)]
//     pub list: Account<'info, TodoList>,
//     #[account(mut)]
//     pub list_owner: AccountInfo<'info>,
//     #[account(mut)]
//     pub item: Account<'info, ListItem>,
//     pub user: Signer<'info>,
// }


