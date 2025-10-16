import { Settings } from '@infinity/types'

export class SolanaSettings extends Settings {
  readonly privateKey: string
  readonly rpcEndpoint: string

  constructor({ privateKey, rpcEndpoint }: { privateKey: string; rpcEndpoint: string }) {
    super()
    this.privateKey = privateKey
    this.rpcEndpoint = rpcEndpoint
  }
}
