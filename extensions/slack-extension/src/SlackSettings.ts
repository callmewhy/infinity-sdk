import { Settings } from '@infinity/types'

export class SlackSettings extends Settings {
  token: string
  channel: string

  constructor({ token, channel }: { token: string; channel: string }) {
    super()
    this.token = token
    this.channel = channel
  }
}
