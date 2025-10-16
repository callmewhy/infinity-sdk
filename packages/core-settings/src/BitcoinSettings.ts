import { Settings } from '@infinity/types'

export type BitcoinNetwork = 'main'

export class BitcoinSettings extends Settings {
  readonly privateKey: string
  readonly network: BitcoinNetwork
  readonly changeAddress: string
  readonly toAddress: string

  constructor({
    privateKey,
    network,
    changeAddress,
    toAddress,
  }: {
    privateKey: string
    network: BitcoinNetwork
    changeAddress: string
    toAddress: string
  }) {
    super()
    this.privateKey = privateKey
    this.network = network
    this.changeAddress = changeAddress
    this.toAddress = toAddress
  }
}
