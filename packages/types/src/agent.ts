import { Profile } from './profile'
import { Perception } from './perception'
import { Inspiration } from './inspiration'
import { Tool } from './tool'
import { Action } from './action'
import { Context } from './context'
import { Task } from './task'
import { Settings } from './settings'
import { Model } from './model'

/**
 * Agent is the main interface for the agent. It contains the profile, settings, model, perceptions, inspirations, tools, tasks, and actions.
 */
export interface Agent {
  profile: Profile
  settings: Settings[]
  model: Model
  tools: (new (context: Context) => Tool)[]
  perceptions: (new (context: Context) => Perception)[]
  inspirations: (new (context: Context) => Inspiration)[]
  tasks: (new (context: Context) => Task)[]
  actions: (new (context: Context) => Action)[]
}
