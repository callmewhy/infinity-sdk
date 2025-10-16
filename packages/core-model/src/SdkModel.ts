import { Context, Model } from '@infinity/types'
import { CoreMessage, experimental_generateImage as generateImage, generateText, ImageModel, LanguageModel } from 'ai'

export class SdkModel extends Model {
  private readonly languageModel?: LanguageModel
  private readonly imageModel?: ImageModel
  private readonly musicModel?: (prompt: string) => Promise<Buffer>
  private context?: Context

  constructor({
    languageModel,
    imageModel,
    musicModel,
  }: {
    languageModel?: LanguageModel
    imageModel?: ImageModel
    musicModel?: (prompt: string) => Promise<Buffer>
  }) {
    super()
    this.languageModel = languageModel
    this.imageModel = imageModel
    this.musicModel = musicModel
  }

  initialize(context: Context) {
    this.context = context
  }

  async generateText({ system, messages }: { system: string; messages: CoreMessage[] }) {
    if (!this.languageModel) {
      throw new Error('Language model not found')
    }
    return await generateText({
      system,
      messages,
      maxSteps: 5,
      model: this.languageModel,
      tools: this.context?.getTools(),
    })
  }

  async generateImage({ prompt }: { prompt: string }) {
    if (!this.imageModel) {
      throw new Error('Image model not found')
    }
    const { image } = await generateImage({
      prompt,
      model: this.imageModel,
    })

    return { image: Buffer.from(image.uint8Array) }
  }

  async generateMusic({ prompt }: { prompt: string }) {
    if (!this.musicModel) {
      throw new Error('Music model not found')
    }

    const music = await this.musicModel(prompt)
    return { music }
  }
}
