import { Settings } from '@infinity/types'
import { EvmChainName } from '@/types'

export class EthereumSettings extends Settings {
  readonly privateKey: `0x${string}`
  readonly chainName: EvmChainName
  readonly rpcUrl: string

  constructor({
    privateKey,
    chainName,
    rpcUrl,
  }: {
    privateKey: `0x${string}`
    chainName: EvmChainName
    rpcUrl: string
  }) {
    super()
    this.privateKey = privateKey
    this.chainName = chainName
    this.rpcUrl = rpcUrl
  }
}
