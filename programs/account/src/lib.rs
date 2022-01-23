use anchor_lang::prelude::*;

declare_id!("4kiCL5ZnfTViX7WddCYvGMowULgkJNrnAAWRoz3JVT7e");

#[program]
pub mod anchor {
    use super::*;

    pub fn create(
        ctx: Context<Create>,
        name: String,
    ) -> ProgramResult {
        let item = &mut ctx.accounts.item;
        let user: &Signer = &ctx.accounts.user;
        item.name = name;

        Ok(())
    }


    pub fn pay(
        ctx: Context<Pay>,
        amount: u64,
    ) -> ProgramResult {
        let item1 = &mut ctx.accounts.item1;
        let item2 = &mut ctx.accounts.item2;
        let user: &Signer = &ctx.accounts.user;
        item1.amount += amount;
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

    // //Error: Signature verification failed
    // pub fn receive(
    //     ctx: Context<Receive>,
    //     amount: u64,
    // ) -> ProgramResult {
    //     // let item1 = &mut ctx.accounts.item1;
    //     // let item2 = &mut ctx.accounts.item2;
    //     let payer: &Signer = &ctx.accounts.payer;
    //     // item1.amount += amount;
    //     // item2.amount += amount;


    //     let ix = anchor_lang::solana_program::system_instruction::transfer(
    //         &ctx.accounts.payer.key(),
    //         &ctx.accounts.user.key(),
    //         amount,
    //     );
    //     anchor_lang::solana_program::program::invoke(
    //         &ix,
    //         &[
    //             ctx.accounts.payer.to_account_info(),
    //             ctx.accounts.user.to_account_info(),
    //             ctx.accounts.system_program.to_account_info(),
    //         ],
    //     );

    //     Ok(())
    // }

    pub fn receive(
        ctx: Context<Receive>,
        amount: u64,
    ) -> ProgramResult {
        // let item1 = &mut ctx.accounts.item1;
        // let item2 = &mut ctx.accounts.item2;
        let payer= &ctx.accounts.payer;
        // item1.amount += amount;
        // item2.amount += amount;


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
    
}

#[derive(Accounts)]
#[instruction(amount: u64)]
pub struct Receive<'info> {
    // #[account(mut)]
    // pub item1: Account<'info, DataAccount>,
    // #[account(mut)]
    // pub item2: Account<'info, DataAccount>,
    #[account(mut)]
    pub user: AccountInfo<'info>,
    #[account(mut)]
    pub payer: Signer<'info>,
    pub system_program: Program<'info, System>,
}


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

#[derive(Accounts)]
pub struct Create<'info> {
    #[account(init, payer=user, space= 64)]
    pub item: Account<'info, DataAccount>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}


#[account]
pub struct DataAccount{
    pub name: String,
    pub amount: u64,
}


        


