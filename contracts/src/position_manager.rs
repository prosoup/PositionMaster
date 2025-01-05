use anchor_lang::prelude::*;

declare_id!("5Yo6zLfHDqzS3J1RaTVep5zj4wBvXxaXvqVgUt4RqaNm");

#[program]
pub mod position_manager {
    use super::*;

    pub fn create_position(ctx: Context<CreatePosition>, liquidity: u64, stake_amount: u64, risk_level: u64) -> Result<()> {
        let position = &mut ctx.accounts.position;
        position.liquidity = liquidity;
        position.stake_amount = stake_amount;
        position.risk_level = risk_level;
        Ok(())
    }

    pub fn rebalance_position(ctx: Context<RebalancePosition>, new_liquidity: u64) -> Result<()> {
        let position = &mut ctx.accounts.position;
        position.liquidity = new_liquidity;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct CreatePosition<'info> {
    #[account(init, payer = user, space = 8 + 64)]
    pub position: Account<'info, Position>,
    #[account(mut)]
    pub user: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
pub struct RebalancePosition<'info> {
    #[account(mut)]
    pub position: Account<'info, Position>,
    #[account(mut)]
    pub user: Signer<'info>,
}

#[account]
pub struct Position {
    pub liquidity: u64,
    pub stake_amount: u64,
    pub risk_level: u64,
}
