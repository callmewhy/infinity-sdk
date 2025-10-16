import { mainnet, sepolia } from 'viem/chains'

export enum EvmChainName {
  mainnet = 'mainnet',
  sepolia = 'sepolia',
}

export function getEvmChainByName(name: `${EvmChainName}`) {
  return {
    mainnet,
    sepolia,
  }[name]
}
