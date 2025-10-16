import { ContextModule } from './base'

/**
 * Task is the smallest unit of work, which can be executed by the agent. The output of the task is the artifact which will be used by actions.
 */
export class Task extends ContextModule {
  description: string = 'Task description'

  async execute() {
    throw new Error('Method not implemented.')
  }
}
