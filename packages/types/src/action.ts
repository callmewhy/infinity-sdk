import { Artifact } from './context'
import { ContextModule } from './base'

/**
 * Action is the action after the plan, task completion will produce an artifact, and action will process the artifact.
 */
export class Action extends ContextModule {
  async execute(artifact: Artifact) {
    throw new Error(`Method not implemented. ${artifact}`)
  }
}
