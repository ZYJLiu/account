use anchor_lang::prelude::*;
use anchor_lang::AccountsClose;

declare_id!("4kiCL5ZnfTViX7WddCYvGMowULgkJNrnAAWRoz3JVT7e");

#[program]
pub mod todo {
    // use anchor_lang::solana_program::{program::invoke, system_instruction::transfer};

    use super::*;
    pub fn new_list(
        ctx: Context<NewList>,
        name: String,
        capacity: u16,
        account_bump: u8,
    ) -> ProgramResult {
        // Create a new account
        let list = &mut ctx.accounts.list;
        list.list_owner = *ctx.accounts.user.to_account_info().key;
        list.bump = account_bump;
        list.name = name;
        list.capacity = capacity;
        Ok(())
    }

    // pub fn add(
    //     ctx: Context<Add>,
    //     _list_name: String,
    //     item_name: String,
    //     bounty: u64,
    // ) -> ProgramResult {
    //     let user = &ctx.accounts.user;
    //     let list = &mut ctx.accounts.list;
    //     let item = &mut ctx.accounts.item;

    //     if list.lines.len() >= list.capacity as usize {
    //         return Err(TodoListError::ListFull.into());
    //     }

    //     list.lines.push(*item.to_account_info().key);
    //     item.name = item_name;
    //     item.creator = *user.to_account_info().key;

    //     // Move the bounty to the account. We account for the rent amount that Anchor's init
    //     // already transferred into the account.
    //     let account_lamports = **item.to_account_info().lamports.borrow();
    //     let transfer_amount = bounty
    //         .checked_sub(account_lamports)
    //         .ok_or(TodoListError::BountyTooSmall)?;

    //     if transfer_amount > 0 {
    //         invoke(
    //             &transfer(
    //                 user.to_account_info().key,
    //                 item.to_account_info().key,
    //                 transfer_amount,
    //             ),
    //             &[
    //                 user.to_account_info(),
    //                 item.to_account_info(),
    //                 ctx.accounts.system_program.to_account_info(),
    //             ],
    //         )?;
    //     }

    //     Ok(())
    // }

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

fn name_seed(name: &str) -> &[u8] {
    let b = name.as_bytes();
    if b.len() > 32 {
        &b[0..32]
    } else {
        b
    }
}

#[derive(Accounts)]
#[instruction(name: String, capacity: u16, list_bump: u8)]
pub struct NewList<'info> {
    #[account(init,
        payer=user,
        space=TodoList::space(&name, capacity),
        seeds=[
            b"todolist",
            user.to_account_info().key.as_ref(),
            name_seed(&name)
        ],
        bump=list_bump)]
    pub list: Account<'info, TodoList>,
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// #[derive(Accounts)]
// #[instruction(list_name: String, item_name: String, bounty: u64)]
// pub struct Add<'info> {
//     #[account(mut, has_one=list_owner @ TodoListError::WrongListOwner, seeds=[b"todolist", list_owner.to_account_info().key.as_ref(), name_seed(&list_name)], bump=list.bump)]
//     pub list: Account<'info, TodoList>,
//     pub list_owner: AccountInfo<'info>,
//     // 8 byte discriminator,
//     #[account(init, payer=user, space=ListItem::space(&item_name))]
//     pub item: Account<'info, ListItem>,
//     pub user: Signer<'info>,
//     pub system_program: Program<'info, System>,
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

#[account]
pub struct TodoList {
    pub list_owner: Pubkey,
    pub bump: u8,
    pub capacity: u16,
    pub name: String,
    pub lines: Vec<Pubkey>,
}

impl TodoList {
    fn space(name: &str, capacity: u16) -> usize {
        // discriminator + owner pubkey + bump + capacity
        8 + 32 + 1 + 2 +
            // name string
            4 + name.len() +
            // vec of item pubkeys
            4 + (capacity as usize) * std::mem::size_of::<Pubkey>()
    }
}

// #[account]
// pub struct ListItem {
//     pub creator: Pubkey,
//     pub creator_finished: bool,
//     pub list_owner_finished: bool,
//     pub name: String,
// }

// impl ListItem {
//     fn space(name: &str) -> usize {
//         // discriminator + creator pubkey + 2 bools + name string
//         8 + 32 + 1 + 1 + 4 + name.len()
//     }
// }