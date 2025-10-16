import { tagoreAgent } from './tagore'

tagoreAgent.start()

process.once('SIGINT', async () => {
  tagoreAgent.stop()
  process.exit()
})
process.once('SIGTERM', async () => {
  tagoreAgent.stop()
  process.exit()
})
