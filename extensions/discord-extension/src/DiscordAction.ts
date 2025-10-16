import { Action, Artifact } from '@infinity/types'
import { DiscordSettings } from '@/DiscordSettings'
import { DiscordPerception } from '@/DiscordPerception'

export class DiscordAction extends Action {
  async execute(artifact: Artifact): Promise<void> {
    const discord = this.context.getPerception(DiscordPerception)
    if (artifact.text && this.settings.channelId) {
      await discord.sendText(this.settings.channelId, artifact.text)
    }
  }

  get settings() {
    return this.context.getSettings(DiscordSettings)
  }
}
