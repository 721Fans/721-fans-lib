import { ethers } from 'ethers';
import { configurations } from './config'

// @ts-ignore
export const getInjectedProvider = () => new ethers.providers.Web3Provider(window.web3.currentProvider)

export const getxDaiProvider = () => {
  const { url } = configurations.xDai
  const provider = new ethers.providers.JsonRpcProvider(url)
  return provider
}

export const getMetamaskSigner = () => {
  const provider = getInjectedProvider()
  const signer = provider.getSigner()
  return signer
}


export const getUserNetwork = async () => {
  const provider = getInjectedProvider()
  return provider.getNetwork()
}

export const getUserAddress = async () => {
  // @ts-ignore
  const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
  // const account = await provider.listAccounts()
  const account = accounts[0];
  return account
}

export const getxDaiBalance = async (address: string, provider = getxDaiProvider()) => {
  const balance = await provider.getBalance(address)
  return ethers.utils.formatUnits(balance, 18)
}