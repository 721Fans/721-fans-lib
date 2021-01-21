
export const isDev = true

const contracts = {
  FanToken: {
    address: '0x3716470B56A73Ef43EAa4Cde177ffdb04Fc0C9dc',
    abi: [

      "function trustedForwarder() public view returns(address)",

      // Read-Only Functions
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)",
      "function symbol() view returns (string)",

      "function approve(address, uint256) public returns (bool)",
      "function allowance(address owner, address spender) public view returns (uint256)",

      // Authenticated Functions
      "function transfer(address to, uint amount) returns (boolean)",

      // Events
      "event Transfer(address indexed from, address indexed to, uint amount)",

      // GSN
      "function setTrustedForwarder(address)",
    ]
  },
  FanEscrow: {
    address: '0x7D4671B6E58351C868Ef26f801E2bf9a97C7a86B',
    abi: [
      `function transferEscrowed(bytes32, uint256) public`,
      `function transferEscrowedBot(bytes32, uint256, address) public`,
      `function balanceOf(bytes32) public view returns(uint256)`,
      `function balanceOfTotal(bytes32) public view returns(uint256)`,
      `function setIdentityAndWithdraw(bytes32 uuid, address userAddress, bytes memory signature)`
    ]
  },
  Forwarder: {
    address: '0xE5c84156a782384C1d97EedD0917e0107F9d0B0F',
    abi: [
      {
        "inputs": [],
        "stateMutability": "nonpayable",
        "type": "constructor"
      },
      {
        "anonymous": false,
        "inputs": [
          {
            "indexed": true,
            "internalType": "address",
            "name": "previousOwner",
            "type": "address"
          },
          {
            "indexed": true,
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "OwnershipTransferred",
        "type": "event"
      },
      {
        "inputs": [],
        "name": "DOMAIN_NAME",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "DOMAIN_SEPARATOR",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "EIP712_DOMAIN_TYPE",
        "outputs": [
          {
            "internalType": "string",
            "name": "",
            "type": "string"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "REQUEST_TYPEHASH",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "from",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "to",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "token",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "txGas",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "tokenGasPrice",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "batchId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "batchNonce",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
              },
              {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
              }
            ],
            "internalType": "struct FanForwarder.ERC20ForwardRequest",
            "name": "req",
            "type": "tuple"
          },
          {
            "internalType": "bytes",
            "name": "sig",
            "type": "bytes"
          }
        ],
        "name": "executeEIP712",
        "outputs": [
          {
            "internalType": "bool",
            "name": "success",
            "type": "bool"
          },
          {
            "internalType": "bytes",
            "name": "ret",
            "type": "bytes"
          }
        ],
        "stateMutability": "payable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "from",
            "type": "address"
          },
          {
            "internalType": "uint256",
            "name": "batchId",
            "type": "uint256"
          }
        ],
        "name": "getNonce",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "from",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "to",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "token",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "txGas",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "tokenGasPrice",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "batchId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "batchNonce",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
              },
              {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
              }
            ],
            "internalType": "struct FanForwarder.ERC20ForwardRequest",
            "name": "req",
            "type": "tuple"
          }
        ],
        "name": "getSignedArgsDigest",
        "outputs": [
          {
            "internalType": "bytes32",
            "name": "",
            "type": "bytes32"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "name": "highestBatchId",
        "outputs": [
          {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "owner",
        "outputs": [
          {
            "internalType": "address",
            "name": "",
            "type": "address"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      },
      {
        "inputs": [],
        "name": "renounceOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "internalType": "address",
            "name": "newOwner",
            "type": "address"
          }
        ],
        "name": "transferOwnership",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
      },
      {
        "inputs": [
          {
            "components": [
              {
                "internalType": "address",
                "name": "from",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "to",
                "type": "address"
              },
              {
                "internalType": "address",
                "name": "token",
                "type": "address"
              },
              {
                "internalType": "uint256",
                "name": "txGas",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "tokenGasPrice",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "batchId",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "batchNonce",
                "type": "uint256"
              },
              {
                "internalType": "uint256",
                "name": "deadline",
                "type": "uint256"
              },
              {
                "internalType": "bytes",
                "name": "data",
                "type": "bytes"
              }
            ],
            "internalType": "struct FanForwarder.ERC20ForwardRequest",
            "name": "req",
            "type": "tuple"
          },
          {
            "internalType": "bytes",
            "name": "sig",
            "type": "bytes"
          }
        ],
        "name": "verifyEIP712",
        "outputs": [
          {
            "internalType": "bool",
            "name": "",
            "type": "bool"
          }
        ],
        "stateMutability": "view",
        "type": "function"
      }
    ]
  },
  IdentityProvider: {
    address: '0xc3619f7F39783a71AFaa20767A823dd16bdDFA49',
    abi: [
      `function setIdentity(bytes32, address, bytes) public`,
      `function getAddress(bytes32) public view returns (address)`,
      `function getUuid(address _address) public view returns (bytes32)`
    ]
  }
}

export const INFURA = process.env.INFURA

export const configurations = {
  'goerli': {
    url: `https://goerli.infura.io/v3/${INFURA}`,
    chainId: 5,
    name: 'goerli',
  },
  'hardhat': {
    url: 'http://127.0.0.1:8545',
    name: 'hardhat',
    chainId: 1337,
  },
  'xDai': {
    url: 'https://dai.poa.network',
    name: 'xDai',
    contracts
  }
}


// You can use any standard network name
//  - "homestead"
//  - "rinkeby"
//  - "ropsten"
//  - "goerli"
//  - "kovan"
export const NETWORK_NAME = 'goerli'
export const config = configurations[NETWORK_NAME]