import { beethovenAgent } from './beethoven'

beethovenAgent.start()

process.once('SIGINT', async () => {
  beethovenAgent.stop()
  process.exit()
})
process.once('SIGTERM', async () => {
  beethovenAgent.stop()
  process.exit()
})
