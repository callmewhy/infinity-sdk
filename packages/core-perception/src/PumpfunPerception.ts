import { Perception } from '@infinity/types'
import axios from 'axios'

interface PumpfunToken {
  name: string
  description: string
  complete: boolean
}

export class PumpfunPerception extends Perception {
  async getTrendingTokens() {
    const response = await axios.get<PumpfunToken[]>(
      'https://frontend-api.pump.fun/coins/for-you?offset=0&limit=50&includeNsfw=false',
    )
    return response.data.filter((t) => t.complete && t.description?.length > 5).slice(0, 20)
  }
}
