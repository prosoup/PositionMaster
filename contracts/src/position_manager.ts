import { AnchorProvider, Program, web3 } from '@project-serum/anchor';
import { PositionManager } from '../target/types/position_manager';

const { SystemProgram } = web3;
const provider = AnchorProvider.local();
const program = new Program<PositionManager>(id, provider);

async function testCreatePosition() {
  const user = web3.Keypair.generate();
  const position = web3.Keypair.generate();
  
  const tx = await program.methods
    .createPosition(new web3.BN(1000), new web3.BN(500), new web3.BN(1))
    .accounts({
      position: position.publicKey,
      user: user.publicKey,
      systemProgram: SystemProgram.programId,
    })
    .signers([user, position])
    .rpc();

  console.log('Created position transaction signature:', tx);
}

async function testRebalancePosition() {
  const position = web3.Keypair.generate();
  const tx = await program.methods
    .rebalancePosition(new web3.BN(2000))
    .accounts({
      position: position.publicKey,
      user: user.publicKey,
    })
    .signers([user, position])
    .rpc();

  console.log('Rebalanced position transaction signature:', tx);
}

testCreatePosition();
testRebalancePosition();
