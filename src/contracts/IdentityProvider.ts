import { ethers, BigNumber } from "ethers"
import { keccak256 } from "ethers/lib/utils"

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
  const identityProvider = await getIdentityProvider()
  const address = await identityProvider.getAddress(uuid)
  const bn = BigNumber.from(address.toString())
  if (bn.toString() !== '0') {
    return address
  }
  return undefined
}

// FIXME add expiration
export const signIdentityRecord = async (uuid: string, userAddress: string, pkVerifier: string) => {
  const argsPacked = await ethers.utils.solidityPack(['bytes32', 'address'], [uuid, userAddress])
  const digest = keccak256(argsPacked)
  const oracle = new ethers.utils.SigningKey(pkVerifier)
  const signature = oracle.signDigest(digest)
  const sigFlat = ethers.utils.joinSignature(signature)
  return {
    digest: digest,
    signature: sigFlat
  }
}
