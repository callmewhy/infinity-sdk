import { Context, Perception } from '@infinity/types'
import { Account, createWalletClient, getAddress, http, publicActions } from 'viem'
import { EthereumSettings } from '@/EthereumSettings'
import { privateKeyToAccount } from 'viem/accounts'
import { getEvmChainByName } from '@/types'

export class EthereumPerception extends Perception {
  private account: Account

  constructor(context: Context) {
    super(context)
    const { privateKey } = context.getSettings(EthereumSettings)
    this.account = privateKeyToAccount(privateKey)
  }

  get settings() {
    return this.context.getSettings(EthereumSettings)
  }

  // Method to get account address
  getAddress(): string {
    return this.account.address
  }

  // Method to transfer ether from the current account to another account
  async transfer(to: string, amount: bigint) {
    const chain = getEvmChainByName(this.settings.chainName)
    const account = this.account
    const client = createWalletClient({
      account,
      chain,
      transport: http(this.settings.rpcUrl),
    }).extend(publicActions)

    const toAddress = getAddress(to)

    return await client.sendTransaction({
      account,
      to: toAddress,
      value: amount,
    })
  }
}
