import { Context, Perception } from '@infinity/types' // Assumed imports
import { SlackSettings } from '@/SlackSettings' // Assumed local settings file
import { WebClient } from '@slack/web-api'

export class SlackPerception extends Perception {
  private client: WebClient

  constructor(context: Context) {
    super(context)
    const { token } = context.getSettings(SlackSettings)
    this.client = new WebClient(token)
  }

  // Method to send a message to a Slack channel
  async sendMessage(channel: string, text: string): Promise<void> {
    try {
      const result = await this.client.chat.postMessage({
        channel: channel,
        text: text,
      })
      console.log(`Message sent successfully, ts: ${result.ts}, channel: ${result.channel}`)
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  // Method to retrieve user information
  async getUserInfo(userId: string): Promise<void> {
    try {
      const result = await this.client.users.info({
        user: userId,
      })
      console.log(`User info: ${JSON.stringify(result.user)}`)
    } catch (error) {
      console.error('Error retrieving user information:', error)
    }
  }

  // Method to retrieve channel information
  async getChannelInfo(channelId: string): Promise<void> {
    try {
      const result = await this.client.conversations.info({
        channel: channelId,
      })
      console.log(`Channel info: ${JSON.stringify(result.channel)}`)
    } catch (error) {
      console.error('Error retrieving channel information:', error)
    }
  }
}
