use anchor_lang::prelude::*;
use anchor_lang::AccountsClose;

declare_id!("4kiCL5ZnfTViX7WddCYvGMowULgkJNrnAAWRoz3JVT7e");

#[program]
pub mod anchor {
    use super::*;

    pub fn create_list(
        ctx: Context<CreateList>,
        name: String,
        capacity: u16,
        account_bump: u8,
    ) -> ProgramResult {
        // Create a new account
        let list = &mut ctx.accounts.list;
        list.owner = *ctx.accounts.user.to_account_info().key;
        list.bump = account_bump;
        list.name = name;
        list.capacity = capacity;
        Ok(())
    }

    pub fn add_item(
        ctx: Context<AddItem>,
        _list_name: String,
        item_name: String,
    ) -> ProgramResult {
        let list = &mut ctx.accounts.list;
        let item = &mut ctx.accounts.item;
        let user: &Signer = &ctx.accounts.user;
        
        list.lines.push(*item.to_account_info().key);
        item.creator = *user.to_account_info().key;
        item.name = item_name;
        
        Ok(())
    }

    pub fn cancelitem(
        ctx: Context<CancelItem>,
        item: Pubkey) 
        -> ProgramResult {
        let item = &mut ctx.accounts.item;
        let item_creator = &ctx.accounts.item_creator;
        let user = ctx.accounts.user.to_account_info().key;
        item.close(item_creator.to_account_info())?;
        
        Ok(())
    }

    pub fn cancellist(
        ctx: Context<CancelList>, 
        _list_name: String) 
        -> ProgramResult {
        let list = &mut ctx.accounts.list;
        let user = ctx.accounts.user.to_account_info().key;
        let item_creator = &ctx.accounts.item_creator;
        list.close(item_creator.to_account_info())?;
        Ok(())
    }

       pub fn receive(
        ctx: Context<Receive>,
        amount: u64,
    ) -> ProgramResult {
        let item1 = &mut ctx.accounts.item1;
        let item2 = &mut ctx.accounts.item2;
        let payer= &ctx.accounts.payer;
        item1.amount += amount;
        item2.amount += amount;


        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.payer.key(),
            &ctx.accounts.user.key(),
            amount * 1000000000,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.payer.to_account_info(),
                ctx.accounts.user.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        );

        Ok(())
    }

    pub fn pay(
        ctx: Context<Pay>,
        amount: u64,
    ) -> ProgramResult {
        let item1 = &mut ctx.accounts.item1;
        let item2 = &mut ctx.accounts.item2;
        let user: &Signer = &ctx.accounts.user;
        item1.amount -= amount;
        item2.amount += amount;


        let ix = anchor_lang::solana_program::system_instruction::transfer(
            &ctx.accounts.user.key(),
            &ctx.accounts.receiver.key(),
            amount * 1000000000,
        );
        anchor_lang::solana_program::program::invoke(
            &ix,
            &[
                ctx.accounts.user.to_account_info(),
                ctx.accounts.receiver.to_account_info(),
                ctx.accounts.system_program.to_account_info(),
            ],
        );

        Ok(())
    }

    
}

fn name_seed(name: &str) -> &[u8] {
    let b = name.as_bytes();
    if b.len() > 32 {
        &b[0..32]
    } else {
        b
    }
}


//Create List
#[derive(Accounts)]
#[instruction(name: String, capacity: u16, list_bump: u8)]
pub struct CreateList<'info> {
    #[account(init,
        payer=user,
        space=List::space(&name, capacity),
        seeds=[
            b"list",
            user.to_account_info().key.as_ref(),
            name_seed(&name)
        ],
        bump=list_bump)]
    pub list: Account<'info, List>,
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}


//"List" Data Account fields
#[account]
pub struct List {
    pub owner: Pubkey,
    pub name: String,
    pub bump: u8,
    pub capacity: u16,
    pub lines: Vec<Pubkey>,
}

impl List {
    fn space(name: &str, capacity: u16) -> usize {
        // discriminator + owner pubkey + bump + capacity
        8 + 32 + 1 + 2 +
            // name string
            4 + name.len() +
            // vec of item pubkeys
            4 + (capacity as usize) * std::mem::size_of::<Pubkey>()
    }
}

//Create Item
#[derive(Accounts)]
#[instruction(list_name: String, item_name: String)]
pub struct AddItem<'info> {
    #[account(mut, has_one=owner, seeds=[b"list", owner.to_account_info().key.as_ref(), name_seed(&list_name)], bump=list.bump)]
    pub list: Account<'info, List>,
    pub owner: AccountInfo<'info>,
    #[account(init, payer=user, space=DataAccount::space(&item_name))]
    pub item: Account<'info, DataAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

//Item Data account fields
#[account]
pub struct DataAccount{
    pub creator: Pubkey,
    pub name: String,
    pub amount: u64,
}

impl DataAccount {
    fn space(name: &str) -> usize {
        // discriminator + name string + creator pubkey + amount?
        8 + 4 + name.len() + 32 + 8
    }
}

//Close List
#[derive(Accounts)]
#[instruction(list_name: String)]
pub struct CancelList<'info> {
    #[account(mut, 
      has_one=owner,
      seeds=[b"list", owner.to_account_info().key.as_ref(), name_seed(&list_name)], bump=list.bump)]
    pub list: Account<'info, List>,
    pub owner: AccountInfo<'info>,
    pub item_creator: AccountInfo<'info>,
    pub user: Signer<'info>,
}


//Close Item Data Account
#[derive(Accounts)]
#[instruction(item: Pubkey)]
pub struct CancelItem<'info> {
    pub item: Account<'info, DataAccount>,
    pub item_creator: AccountInfo<'info>,
    pub user: Signer<'info>,
}


// Receive SOL
#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct Receive<'info> {
    #[account(mut)]
    pub item1: Account<'info, DataAccount>,
    #[account(mut)]
    pub item2: Account<'info, DataAccount>,
    #[account(mut)]
    pub payer: Signer<'info>,
    #[account(mut)]
    pub user: AccountInfo<'info>,
    pub system_program: Program<'info, System>,
}
// Pay SOL
#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct Pay<'info> {
    #[account(mut)]
    pub item1: Account<'info, DataAccount>,
    #[account(mut)]
    pub item2: Account<'info, DataAccount>,
    #[account(mut)]
    pub receiver: AccountInfo<'info>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}


        


