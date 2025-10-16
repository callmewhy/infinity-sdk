import dotenv from 'dotenv'
import {
  AgentRunner,
  BitcoinSettings,
  createDeepSeek,
  createOpenAI,
  GenerateImageTask,
  InscribeAction,
  PumpfunPerception,
  PumpfunTrendingInspiration,
  SdkModel,
  TelegramAction,
  TelegramSettings,
  TokenAddressTool,
  TriggerType,
  TwitterAction,
  TwitterPerception,
} from '@infinity/sdk'

dotenv.config()

const telegramSettings = new TelegramSettings({
  botToken: process.env.TELEGRAM_BOT_TOKEN ?? '',
  groupId: parseInt(process.env.TELEGRAM_GROUP_ID ?? ''),
})

const languageModel = createDeepSeek({
  apiKey: process.env.DEEPSEEK_API_KEY ?? '',
})('deepseek-chat')

const imageModel = createOpenAI({
  apiKey: process.env.OPENAI_API_KEY ?? '',
}).image('dall-e-3')

const model = new SdkModel({
  languageModel,
  imageModel,
})

export const picassoAgent = new AgentRunner({
  settings: [
    telegramSettings,
    new BitcoinSettings({
      privateKey: '',
      network: 'main',
      changeAddress: '',
      toAddress: '',
    }),
  ],
  profile: {
    name: 'Picasso',
    bio: 'I am Picasso, a crypto artist. I create images in an abstract style.',
    knowledge: ['Picasso is a famous artist agent created by Infinity AI.'],
    topics: ['art', 'painting', 'crypto'],
    style: [
      'Innovative and varied, characterized by the abstraction of form, the use of geometric shapes, and fragmented perspectives.',
      'Featuring bold colors, expressive lines, and a rejection of traditional techniques.',
      'Embracing experimentation and a dynamic approach to subjects, often challenging viewers’ perceptions.',
    ],
  },
  triggers: [{ type: TriggerType.Schedule, intervalSeconds: 60 }],
  model,
  tools: [TokenAddressTool],
  perceptions: [TwitterPerception, PumpfunPerception],
  inspirations: [PumpfunTrendingInspiration],
  tasks: [GenerateImageTask],
  actions: [TelegramAction, InscribeAction, TwitterAction],
})
