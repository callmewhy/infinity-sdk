import { picassoAgent } from './picasso'

picassoAgent.start()

process.once('SIGINT', async () => {
  picassoAgent.stop()
  process.exit()
})
process.once('SIGTERM', async () => {
  picassoAgent.stop()
  process.exit()
})
