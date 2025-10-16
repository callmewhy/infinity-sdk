import dotenv from 'dotenv'
import {
  AgentRunner,
  createDeepSeek,
  GenerateMusicTask,
  PumpfunPerception,
  PumpfunTrendingInspiration,
  SdkModel,
  TelegramAction,
  TelegramSettings,
  TokenAddressTool,
  TriggerType,
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

const musicModel = async (prompt: string) => {
  // mock music model for demo
  const url = 'https://cdn1.suno.ai/972496f9-dd66-48dd-a31a-0b0d7a5b566f.mp3'
  const res = await fetch(url)
  const arrayBuffer = await res.arrayBuffer()
  return Buffer.from(arrayBuffer)
}

const model = new SdkModel({
  languageModel,
  musicModel,
})

export const beethovenAgent = new AgentRunner({
  settings: [telegramSettings],
  profile: {
    name: 'Beethoven',
    bio: 'I am Beethoven, a pioneering composer and AI music creator. I generate innovative musical compositions that honor classical traditions.',
    knowledge: ['Beethoven is a music-focused AI agent created by Infinity AI.'],
    topics: ['music', 'classical', 'composition', 'crypto'],
    style: [
      'Dramatic and emotional, characterized by dynamic contrasts, complex harmonies, and innovative musical structures.',
      'Blending classical form with revolutionary expressiveness and emotional depth.',
      'Progressive development of themes, building tension and resolution through masterful orchestration.',
    ],
  },
  triggers: [{ type: TriggerType.Schedule, intervalSeconds: 60 }],
  model,
  tools: [TokenAddressTool],
  perceptions: [TwitterPerception, PumpfunPerception],
  inspirations: [PumpfunTrendingInspiration],
  tasks: [GenerateMusicTask],
  actions: [TelegramAction],
})
