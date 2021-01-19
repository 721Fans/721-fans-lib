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

export const getEscrowContract = async (provider = getProvider()) => {
  const { address, abi } = contracts.FanEscrow
  const contract = new ethers.Contract(address, abi, provider);
  return contract
}

export const getBalanceDisplay = async (address: string, provider = getProvider()) => {
  const fan = await getFanContract()
  const balance = await fan.balanceOf(address)
  const balanceFormat = ethers.utils.formatUnits(balance, 18)
  return balanceFormat
}

export const getBalanceTotalDisplay = async (uuid: string, provider = getProvider()) => {
  const escrow = await getEscrowContract()
  const balanceTotal = await escrow.balanceOfTotal(uuid);
  const balanceFormat = ethers.utils.formatUnits(balanceTotal, 18)
  return balanceFormat
}