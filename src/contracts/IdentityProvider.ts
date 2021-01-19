import { ethers, BigNumber } from "ethers"

import { configurations } from '../config'

const { contracts, url } = configurations.xDai


export const getProvider = () => {
  const provider = new ethers.providers.JsonRpcProvider(url)
  return provider
}

export const getIdentityProvider = async (write = false, provider = getProvider()) => {
  const { address, abi } = contracts.IdentityProvider
  const signer = provider
  const contract = new ethers.Contract(address, abi, signer);
  return contract
}

export const getVerifiedAddress = async (uuid: string) => {
  const identityProvider = await getIdentityProvider() // request with write access
  const address = await identityProvider.getAddress(uuid)
  const bn = BigNumber.from(address.toString())
  if (bn.toString() !== '0') {
    return address
  }
  return undefined
}
