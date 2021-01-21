import { ethers } from 'ethers'
import * as FAN from './FanToken'
import { configurations } from '../config'
export { FAN }

export * from './IdentityProvider'

const { contracts, url } = configurations.xDai

export const getForwarderContract = async () => {
  const provider = new ethers.providers.JsonRpcProvider(url)
  const { address, abi } = contracts.Forwarder
  const contract = new ethers.Contract(address, abi, provider);
  return contract
}