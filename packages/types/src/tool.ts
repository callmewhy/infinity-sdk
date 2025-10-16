import { CoreTool } from 'ai'
import { ContextModule } from './base'

/**
 * Tool is the function tool to be used during the inference process.
 */
export abstract class Tool extends ContextModule {
  abstract getTool(): CoreTool
}
