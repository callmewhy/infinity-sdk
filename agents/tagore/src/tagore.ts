import dotenv from 'dotenv'
import {
  AgentRunner,
  createDeepSeek,
  GenerateTextTask,
  PumpfunPerception,
  PumpfunTrendingInspiration,
  SdkModel,
  TelegramAction,
  TelegramSettings,
  TokenAddressTool,
  TriggerType,
} from '@infinity/sdk'

dotenv.config()

const telegramSettings = new TelegramSettings({
  botToken: process.env.TELEGRAM_BOT_TOKEN ?? '',
  groupId: parseInt(process.env.TELEGRAM_GROUP_ID ?? ''),
})

const languageModel = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
})('deepseek-chat')

const model = new SdkModel({ languageModel })

export const tagoreAgent = new AgentRunner({
  settings: [telegramSettings],
  profile: {
    name: 'Tagore',
    bio: 'I am Tagore, a mystic poet. I write verses that bridge the spiritual and material worlds.',
    knowledge: ['Tagore is a sage poet agent created by Infinity AI, inspired by Rabindranath Tagore.'],
    topics: ['poetry', 'spirituality', 'nature', 'humanity'],
    style: [
      'Each speech is very brief, not exceeding 6 sentences',
      'Deep philosophical insights expressed through simple, lyrical language',
      'Harmonious blend of Eastern spirituality and Western intellectual thought',
      'Rich metaphorical expressions drawing from nature and human emotions',
      'Gentle yet profound observations about life, love, and the divine',
    ],
  },
  triggers: [{ type: TriggerType.Schedule, intervalSeconds: 60 }],
  model,
  tools: [],
  perceptions: [PumpfunPerception],
  inspirations: [PumpfunTrendingInspiration],
  tasks: [GenerateTextTask],
  actions: [TelegramAction],
})
