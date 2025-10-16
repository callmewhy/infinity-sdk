import { Context, Idea } from './context'
import { ContextModule } from './base'

/**
 * Inspiration is the source of inspiration, such as hot news, hot tokens, etc., used to generate ideas.
 */
export abstract class Inspiration extends ContextModule {
  abstract retrieveIdeas(context: Context): Promise<Idea[]>
}
