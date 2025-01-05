import { Program, Provider } from '@project-serum/anchor';
import { IDL } from './idl/position_manager'; // Assuming you generate an IDL from the position_manager.sol contract

const provider = new Provider(connection, new web3.Account(), { commitment: 'processed' });
const program = new Program(IDL, new PublicKey('<PositionManager Program PublicKey>'), provider);

export const createPosition = async (liquidity: number, stakeAmount: number, riskLevel: number) => {
    const tx = await program.rpc.createPosition(new web3.BN(liquidity), new web3.BN(stakeAmount), new web3.BN(riskLevel), {
        accounts: {
            positionAccount: new PublicKey('<position account public key>'),
            user: provider.wallet.publicKey,
        },
    });
    console.log('Position created:', tx);
};

export const rebalancePosition = async (positionId: number, newLiquidity: number) => {
    const tx = await program.rpc.rebalancePosition(positionId, new web3.BN(newLiquidity), {
        accounts: {
            positionAccount: new PublicKey('<position account public key>'),
            user: provider.wallet.publicKey,
        },
    });
    console.log('Position rebalanced:', tx);
};
