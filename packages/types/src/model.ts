import { BaseModule } from './base'
import { CoreMessage } from 'ai'
import { Context } from './context'

export abstract class Model extends BaseModule {
  abstract initialize(context: Context): void

  abstract generateText({ system, messages }: { system: string; messages: CoreMessage[] }): Promise<{ text: string }>

  abstract generateImage({ prompt }: { prompt: string }): Promise<{ image: Buffer }>

  abstract generateMusic({ prompt }: { prompt: string }): Promise<{ music: Buffer }>
}
