import { Perception } from '@infinity/types'
import { DiscordSettings } from '@/DiscordSettings'
import { REST, Routes } from 'discord.js'

export class DiscordPerception extends Perception {
  async sendText(channelId: string, content: string) {
    await this.client?.post(Routes.channelMessages(channelId), {
      body: { content },
    })
  }

  private get client() {
    const token = this.context.getSettings(DiscordSettings).discordToken
    if (!token) {
      return null
    }
    return new REST({ version: '10' }).setToken(token)
  }
}
