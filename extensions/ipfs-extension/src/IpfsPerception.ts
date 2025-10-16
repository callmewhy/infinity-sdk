import { Context, Perception } from '@infinity/types'
import { create, IPFSHTTPClient } from 'ipfs-http-client'
import { IpfsSettings } from '@/IpfsSettings'

export class IpfsPerception extends Perception {
  private client: IPFSHTTPClient

  constructor(context: Context) {
    super(context)
    const { host, port, protocol } = context.getSettings(IpfsSettings)
    this.client = create({ host, port, protocol })
  }

  // Upload file to IPFS
  public async addFile(content: Buffer | Blob): Promise<string> {
    try {
      const { cid } = await this.client.add(content)
      return cid.toString()
    } catch (error) {
      console.error('Error adding file to IPFS:', error)
      throw error
    }
  }

  // Get file from IPFS
  public async getFile(cid: string): Promise<Buffer> {
    try {
      const chunks: Uint8Array[] = []
      for await (const chunk of this.client.cat(cid)) {
        chunks.push(chunk)
      }
      return Buffer.concat(chunks)
    } catch (error) {
      console.error('Error retrieving file from IPFS:', error)
      throw error
    }
  }
}
