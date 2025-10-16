import { Settings } from '@infinity/types'

export class DiscordSettings extends Settings {
  readonly discordToken: string
  readonly channelId?: string

  constructor({ discordToken, channelId }: { discordToken: string; channelId?: string }) {
    super()
    this.discordToken = discordToken
    this.channelId = channelId
  }
}
