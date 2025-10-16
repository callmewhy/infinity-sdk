import { Action, Artifact } from '@infinity/types'
import { TwitterApi } from 'twitter-api-v2'
import { TwitterSettings } from '@infinity/core-settings'

export class TwitterAction extends Action {
  async execute(artifact: Artifact): Promise<void> {
    if (artifact.text) {
      await this.sendText(artifact.text)
    }
  }

  async sendText(text: string, isRetry = false) {
    if (!this.client) {
      return
    }
    try {
      this.client?.v2.tweet(text)
    } catch (error) {
      if (isRetry) {
        throw error
      } else {
        await this.refreshToken()
        await this.sendText(text, true)
      }
    }
  }

  get twitterSettings() {
    return this.context.getSettings(TwitterSettings)
  }

  get client() {
    const token = this.twitterSettings.accessToken
    if (!token) {
      return null
    }
    return new TwitterApi(token)
  }

  private async refreshToken() {
    if (!this.twitterSettings) {
      return
    }
    const { clientId, clientSecret } = this.twitterSettings
    const twitterApi = new TwitterApi({ clientId, clientSecret })
    const { accessToken, refreshToken } = await twitterApi.refreshOAuth2Token(this.twitterSettings.refreshToken)
    if (!accessToken || !refreshToken) {
      throw new Error('Failed to refresh token')
    }
    this.twitterSettings.refreshToken = refreshToken
    this.twitterSettings.accessToken = accessToken
  }
}
