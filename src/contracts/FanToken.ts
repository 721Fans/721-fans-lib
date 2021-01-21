import { ethers, BigNumber, Wallet } from "ethers"
import { relayTransaction, signTypedDataEthers, signTypedDataMetamask, toMetaTransaction } from '../metatx'
import { configurations } from '../config'
import { signIdentityRecord } from "./IdentityProvider"
import { getMetamaskSigner } from '../provider'

const { contracts, url } = configurations.xDai

export const getProvider = () => {
  const provider = new ethers.providers.JsonRpcProvider(url)
  return provider
}

export const getFanContract = async (address = contracts.FanToken.address, provider = getProvider()) => {
  const { FanToken } = contracts
  const contract = new ethers.Contract(address, FanToken.abi, provider);
  return contract
}

export const getForwarderContract = async (address = contracts.Forwarder.address, provider = getProvider()) => {
  const { Forwarder } = contracts
  const contract = new ethers.Contract(address, Forwarder.abi, provider);
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

export interface DisposableListener {
  dispose() : void;
}

export type BalanceListener = (from: string, to: string, amount: string) => void;

export const subscribeBalanceChanges = async (address: string, listener: BalanceListener) : Promise<DisposableListener> => {
  const fan = await getFanContract()
  let filter = fan.filters.Transfer( )

  const _listener = (from: string, to: string, amount: string, event: any) => {
    // FIXME there seems no easy way to define filter [ [null, address], [null, address]  ]
    if ((from && from.toLowerCase() == address.toLowerCase()) || (to && to.toLowerCase() == address.toLowerCase()) ) {
      listener(from, to, ethers.utils.formatUnits(amount, 18))
    }
  }

  fan.on(filter, _listener)
  return {
    dispose: () => {
      fan.off(filter, _listener)
    }
  }
}

// pkVerifier must be configured as trusted verifier
export const setIdentityAndWithdraw = async (uuid: string, address: string, pkVerifier: string, relayer: Wallet) => {
  const escrow = await getEscrowContract()
  const { signature } = await signIdentityRecord(uuid, address, pkVerifier)
  const tx = await escrow.connect(relayer).setIdentityAndWithdraw(uuid, address, signature)
  return tx.wait()
}

export const getAllowance = async (owner: string) => {
  const escrow = contracts.FanEscrow
  const fan = await getFanContract()
  const allowance = await fan.allowance(owner, escrow.address)
  return ethers.utils.formatUnits(allowance.toString(), 18)
}

export const getTrustedForwarder = async () => {
  const fan = await getFanContract()
  return fan.trustedForwarder()
}

const getNextNonce = async (forwarder: ethers.Contract, address: string) => {
  let highestBatchId = await forwarder.highestBatchId(address)
  highestBatchId = parseInt(highestBatchId.toString())
  let nonce = await forwarder.getNonce(address, highestBatchId)
  nonce = parseInt(nonce)
  return {
    batch: highestBatchId,
    nonce
  }
}

/**
 * Transfer FAN tokens to an Ethereum address using meta transactions
 * @param from 
 * @param toAddress 
 * @param fanAmount 
 * @param relayer 
 * @param fanAddress 
 * @param forwarderAddress 
 * @param provider 
 */
export const transferToAddressMeta = async (
  from: Wallet | string, 
  toAddress: string, 
  fanAmount: string,
  relayer: Wallet | string, 
  fanAddress: string = contracts.FanToken.address, 
  forwarderAddress: string = contracts.Forwarder.address,
  provider = getProvider()
) => {

  //TODO  utils: isBrowser
  const useEthers = typeof window == 'object' ? false : true

  const signer = typeof from == 'string' ? await getMetamaskSigner() : from
  const fromAddress = await signer.getAddress()

  const forwarder = new ethers.Contract(forwarderAddress, contracts.Forwarder.abi, provider)

  const FAN = await getFanContract(fanAddress, provider)
  const _tx = await FAN.connect(signer).populateTransaction.transfer(toAddress, ethers.utils.parseEther(fanAmount), {
    gasLimit: 500 * 1000,
    gasPrice: ethers.utils.parseUnits('1', 'gwei')
  })

  const nonce = await getNextNonce(forwarder, fromAddress)
  const { req, erc20fr } = await toMetaTransaction(fromAddress, FAN.address, _tx, nonce)

  let _signature
  if (useEthers) {
    const { signature } = await signTypedDataEthers(<Wallet>signer, forwarderAddress, erc20fr)
    _signature = signature
  } else {
    const { signature } = await signTypedDataMetamask(fromAddress, forwarderAddress, erc20fr)
    _signature = signature
    // TODO handle "MetaMask Message Signature: User denied message signature." code : 4001
  }

  if (!_signature) {
    throw new Error('Invalid signature')
  }

  // console.log('received signature', _signature)
 
  if (typeof relayer !== 'string') {
    return relayTransaction(relayer, forwarder, req, _signature)
  } else {
    // send tx to relayer endpoint
    return fetch(relayer, {
      method: 'POST',
      body: JSON.stringify({
        tx: req,
        signature: _signature
      })
    })
    .then(response => response.json())
    .then(data => data.receipt)
  }
}

export const approveBot = async (
  fromAddress: string,
  amount: string,
  relayer: string, 
  forwarderAddress: string = contracts.Forwarder.address,
  provider = getProvider()
) => {

  const escrow = contracts.FanEscrow
  const forwarder = new ethers.Contract(forwarderAddress, contracts.Forwarder.abi, provider)
  const FAN = await getFanContract()
  const _amount = ethers.utils.parseEther(amount)
  
  const tx = await FAN.populateTransaction.approve(escrow.address, _amount, {
    gasLimit: 500 * 1000,
    gasPrice: ethers.utils.parseUnits('1', 'gwei')
  })

  const nonce = await getNextNonce(forwarder, fromAddress)
  const { req, erc20fr } = await toMetaTransaction(fromAddress, FAN.address, tx, nonce)

  // FIXME handle bad chain id
  const { signature } = await signTypedDataMetamask(fromAddress, forwarderAddress, erc20fr)

  if (!signature) {
    throw new Error('Signing transaction failed')
  }

  return fetch(relayer, {
    method: 'POST',
    body: JSON.stringify({
      tx: req,
      signature: signature
    })
  })
  .then(response => response.json())
  .then(data => data.receipt)

}

// msg.sender needs to be granted the bot role
export const transferEscrowed = async (from: string, toUuid: string, amountFan: string, signer: Wallet) => {
  const escrow = await getEscrowContract()
  const tx = await escrow.connect(signer).transferEscrowedBot(toUuid, ethers.utils.parseUnits(`${amountFan}`, 18), from)
  const receipt = await tx.wait()
  return {
    receipt
  }
}
