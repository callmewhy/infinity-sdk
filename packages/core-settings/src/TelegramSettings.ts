import { Settings } from '@infinity/types'

export class TelegramSettings extends Settings {
  public botToken: string
  public groupId?: number

  constructor({ botToken, groupId }: { botToken: string; groupId?: number }) {
    super()
    this.botToken = botToken
    this.groupId = groupId
  }
}
