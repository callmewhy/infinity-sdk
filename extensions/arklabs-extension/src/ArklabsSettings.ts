import { Settings } from '@infinity/types'

type Network = 'bitcoin' | 'testnet' | 'regtest' | 'signet' | 'mutinynet'

export class ArklabsSettings extends Settings {
  network: Network
  privateKey: string
  esploraUrl: string
  arkServerUrl: string
  arkServerPublicKey: string

  constructor({
    network,
    privateKey,
    esploraUrl,
    arkServerUrl,
    arkServerPublicKey,
  }: {
    network: Network
    privateKey: string
    esploraUrl: string
    arkServerUrl: string
    arkServerPublicKey: string
  }) {
    super()
    this.network = network
    this.privateKey = privateKey
    this.esploraUrl = esploraUrl
    this.arkServerUrl = arkServerUrl
    this.arkServerPublicKey = arkServerPublicKey
  }
}
