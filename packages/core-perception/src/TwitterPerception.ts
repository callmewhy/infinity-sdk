import { Context, Perception } from '@infinity/types'
import { TwitterApi } from 'twitter-api-v2'
import { TwitterSettings } from '@infinity/core-settings'

export class TwitterPerception extends Perception {
  async getTrendingNews(context: Context) {
    const settings = context.getSettings(TwitterSettings)
    const token = settings.bearerToken
    if (!token) {
      throw new Error('Twitter bearer token is missing in the settings.')
    }

    const client = new TwitterApi(token)
    return await client.v1.trendsByPlace(1)
  }
}
