import { ethers, Wallet } from "ethers";
import { getxDaiProvider } from "../provider";

const use_v4 = true

let rpc_id = 0

const EIP712Domain = [
  { name: "name", type: "string" },
  { name: "version", type: "string" },
  { name: "chainId", type: "uint256" },
  { name: "verifyingContract", type: "address" }
];

const erc20ForwardRequest = [
  { name: 'from', type: 'address' },
  { name: 'to', type: 'address' },
  { name: 'token', type: 'address' },
  { name: 'txGas', type: 'uint256' },
  { name: 'tokenGasPrice', type: 'uint256' },
  { name: 'batchId', type: 'uint256' },
  { name: 'batchNonce', type: 'uint256' },
  { name: 'deadline', type: 'uint256' },
  { name: 'dataHash', type: 'bytes32' }
];

  const getDomainValue = async (forwarderAddress: string, provider = getxDaiProvider()) => {
  // const network = await provider.getNetwork()
  // const { chainId } = network
  const chainId = '1'
  return {
    name: '721Fans Forwarder v1',
    version: '1',
    chainId: chainId,
    verifyingContract: forwarderAddress
  }
}

export const signTypedDataMetamask = async (fromAddress: string, forwarderAddress: string, message: any,) => {

  // FIXME check chain id before signing: must be 1

  const domainValues = await getDomainValue(forwarderAddress)

  // https://github.com/ethereum/EIPs/blob/master/EIPS/eip-712.md#eth_signtypeddata
  const typedData = {
    types: {
      EIP712Domain,
      ERC20ForwardRequest: erc20ForwardRequest
    },
    primaryType: 'ERC20ForwardRequest',
    domain: {
      ...domainValues
    },
    message: {
      ...message
    }
  }

  const payload = {
    id: rpc_id++,
    method: use_v4 ? 'eth_signTypedData_v4' : 'eth_signTypedData',
    params: [
      fromAddress,
      use_v4 ? JSON.stringify(typedData) : typedData
    ],
  };

  const rpcResponse: any = await new Promise((resolve, reject) => {
    // @ts-ignore
    window.ethereum.sendAsync(payload, (err, res) => resolve(res))
  })
  const { result } = rpcResponse
  return {
    signature: result
  }
}

export const signTypedDataEthers = async (signer: Wallet, forwarderAddress: string, data: any) => {
  const domainValue = await getDomainValue(forwarderAddress)
  
  const types = {
    // key MUST match value used in contract hash!!!
    ERC20ForwardRequest: erc20ForwardRequest
  }

  const signature = await signer._signTypedData(domainValue, types, data);
  return {
    signature
  }
}

export interface Nonce {
  batch: number;
  nonce: number
}

export const toMetaTransaction = async (from: string, tokenAddress: string, req: any, batchNonce: Nonce) => {
  const { batch, nonce } = batchNonce
  req.from = from;
  req.batchNonce = 0;
  req.batchId = batch + 1;
  req.txGas = (req.gasLimit).toNumber();
  req.tokenGasPrice = 0;
  req.deadline = 0;

  delete req.gasPrice;
  delete req.gasLimit;
  delete req.chainId;

  req.token = tokenAddress;

  const erc20fr = {
    ...req,
    dataHash: ethers.utils.keccak256(req.data)
  }
  delete erc20fr.data;

  return { req, erc20fr }
}


export const relayTransaction = async (relayer: ethers.Wallet, forwarder: ethers.Contract, req: any, signature: string) => {
  // const result = await forwarder.verifyEIP712(req, _signature)
  // console.log('verify result', result)
  const tx = await forwarder.connect(relayer).executeEIP712(req, signature, {
    gasLimit: 500 * 1000,
    gasPrice: ethers.utils.parseUnits('1', 'gwei')
  });
  const receipt = await tx.wait()
  return receipt
}