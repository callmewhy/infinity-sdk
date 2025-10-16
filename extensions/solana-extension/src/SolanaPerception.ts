import { Context, Perception } from '@infinity/types'
import { Connection, Keypair, PublicKey, sendAndConfirmTransaction, SystemProgram, Transaction } from '@solana/web3.js'
import { SolanaSettings } from '@/SolanaSettings'

export class SolanaPerception extends Perception {
  private readonly connection: Connection
  private readonly keypair: Keypair

  constructor(context: Context) {
    super(context)

    const settings = this.settings
    this.connection = new Connection(settings.rpcEndpoint, 'confirmed')
    this.keypair = Keypair.fromSecretKey(Uint8Array.from(JSON.parse(settings.privateKey)))
  }

  get settings() {
    return this.context.getSettings(SolanaSettings)
  }

  async getAddress(): Promise<string> {
    return this.keypair.publicKey.toBase58()
  }

  async transfer(toAddress: string, amount: number): Promise<string> {
    const toPublicKey = new PublicKey(toAddress)
    const transaction = new Transaction().add(
      SystemProgram.transfer({
        fromPubkey: this.keypair.publicKey,
        toPubkey: toPublicKey,
        lamports: amount,
      }),
    )

    return await sendAndConfirmTransaction(this.connection, transaction, [this.keypair])
  }
}
