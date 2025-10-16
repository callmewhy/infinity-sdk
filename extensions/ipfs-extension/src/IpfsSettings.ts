import { Settings } from '@infinity/types'

export class IpfsSettings extends Settings {
  host: string
  port: number
  protocol: string

  constructor({ host, port, protocol }: { host: string; port: number; protocol: string }) {
    super()
    this.host = host
    this.port = port
    this.protocol = protocol
  }
}
