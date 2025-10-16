import { Action, Artifact } from '@infinity/types'
import { Telegraf } from 'telegraf'
import { TelegramSettings } from '@infinity/core-settings'

export class TelegramAction extends Action {
  async execute(artifact: Artifact): Promise<void> {
    if (artifact.text) {
      await this.sendText(artifact.text)
    }
    if (artifact.image) {
      await this.sendImage(artifact.image)
    }
    if (artifact.music) {
      await this.sendMusic(artifact.music)
    }
  }

  async sendText(text: string) {
    if (!this.telegramGroupId) {
      return
    }
    this.bot?.telegram.sendMessage(this.telegramGroupId, text)
  }

  async sendImage(source: Buffer) {
    if (!this.telegramGroupId) {
      return
    }
    this.bot?.telegram.sendPhoto(this.telegramGroupId, {
      source,
      filename: 'image.png',
    })
  }

  async sendMusic(source: Buffer) {
    if (!this.telegramGroupId) {
      return
    }
    this.bot?.telegram.sendAudio(this.telegramGroupId, {
      source,
      filename: 'music.mp3',
    })
  }

  get telegramGroupId() {
    return this.settings.groupId
  }

  get bot(): Telegraf | null {
    const token = this.settings.botToken
    return new Telegraf(token)
  }

  get settings() {
    return this.context.getSettings(TelegramSettings)
  }
}
