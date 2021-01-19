import { ethers, BigNumber } from "ethers"

import { configurations } from '../config'

const { contracts, url } = configurations.xDai

export const getProvider = () => {
  const provider = new ethers.providers.JsonRpcProvider(url)
  return provider
}

export const getFanContract = async (provider = getProvider()) => {
  const { address, abi } = contracts.FanToken
  const contract = new ethers.Contract(address, abi, provider);
  return contract
}

export const getBalanceDisplay = async (address: string, provider = getProvider()) => {
  const fan = await getFanContract()
  const balance = await fan.balanceOf(address)
  const balanceFormat = ethers.utils.formatUnits(balance, 18)
  return balanceFormat
}
