import { Context } from './context'

export class BaseModule {
  readonly name: string = this.constructor.name

  log(text: string) {
    console.info(`[${this.name}] ${text}`)
  }
}

export class ContextModule extends BaseModule {
  readonly context: Context

  constructor(context: Context) {
    super()
    this.context = context
  }
}
