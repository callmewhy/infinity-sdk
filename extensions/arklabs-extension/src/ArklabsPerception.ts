import { Context, Perception } from '@infinity/types'
import { ArklabsSettings } from '@/ArklabsSettings'
import { InMemoryKey, Wallet } from '@arklabs/wallet-sdk'
import { Identity } from '@arklabs/wallet-sdk/dist/types/wallet'

export class ArklabsPerception extends Perception {
  private readonly identity: Identity
  private readonly wallet: Wallet

  constructor(context: Context) {
    super(context)
    const { privateKey, network, esploraUrl, arkServerUrl, arkServerPublicKey } = context.getSettings(ArklabsSettings)
    this.identity = InMemoryKey.fromHex(privateKey)
    this.wallet = new Wallet({
      identity: this.identity,
      network,
      esploraUrl,
      arkServerUrl,
      arkServerPublicKey,
    })
  }

  sendBitcoin = async (address: string, amount: number, feeRate?: number) => {
    return this.wallet.sendBitcoin({ address, amount, feeRate })
  }

  sendOnchain = async (address: string, amount: number, feeRate?: number) => {
    return this.wallet.sendOnchain({ address, amount, feeRate })
  }

  sendOffchain = async (address: string, amount: number, feeRate?: number) => {
    return this.wallet.sendOffchain({ address, amount, feeRate })
  }

  getBalance = async () => {
    return this.wallet.getBalance()
  }

  getCoins = async () => {
    return this.wallet.getCoins()
  }

  getVirtualCoins = async () => {
    return this.wallet.getVirtualCoins()
  }

  signMessage = async (message: string) => {
    return this.wallet.signMessage(message)
  }

  verifyMessage = async (message: string, signature: string, address: string) => {
    return this.wallet.verifyMessage(message, signature, address)
  }
}
