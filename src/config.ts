
export const isDev = true

const contracts = {
  FanToken: {
    address: '0x52f8E50Ecc053fBF0221775a6f19Bc14C35D44Fb',
    abi: [
      // Read-Only Functions
      "function balanceOf(address owner) view returns (uint256)",
      "function decimals() view returns (uint8)",
      "function symbol() view returns (string)",

      "function approve(address, uint256) public returns (bool)",

      // Authenticated Functions
      "function transfer(address to, uint amount) returns (boolean)",

      // Events
      "event Transfer(address indexed from, address indexed to, uint amount)",

      // GSN
      "function setTrustedForwarder(address)",
    ]
  },
  FanEscrow: {
    address: '0x93511e76E36581B5a61A6fbc422C358837d866b7',
    abi: [
      `function transferEscrowed(bytes32, uint256) public`,
      `function balanceOf(bytes32) public view returns(uint256)`,
      `function balanceOfTotal(bytes32) public view returns(uint256)`,
    ]
  },
  Forwarder: {
    address: '0x54518dF1dC8d6E7cdb541C37E8eD0931f145C665'
  },
  IdentityProvider: {
    address: '0x92AC85C6eF80497AdeD948c183D32Ad62E9B88eF',
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