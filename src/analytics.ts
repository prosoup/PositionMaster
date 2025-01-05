import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';
import { Program, Provider, web3 } from '@project-serum/anchor';
import { IDL } from './idl/analytics'; // Assuming you generate an IDL from the analytics.sol contract

const connection = new Connection(clusterApiUrl('devnet'));
const provider = new Provider(connection, new web3.Account(), { commitment: 'processed' });

const programID = new PublicKey('<Analytics Program PublicKey>');
const program = new Program(IDL, programID, provider);

export const getUserLiquidity = async (userAddress: string): Promise<number> => {
    const userLiquidity = await program.account.totalLiquidity.fetch(new PublicKey(userAddress));
    return userLiquidity.toNumber();
};

export const addLiquidity = async (amount: number) => {
    const transaction = await program.rpc.addLiquidity(new web3.BN(amount), {
        accounts: {
            liquidityAccount: new PublicKey('<liquidity account public key>'),
            user: provider.wallet.publicKey,
        },
    });
    console.log('Liquidity added:', transaction);
};
