import { ethers } from 'ethers';
import jwt from 'jsonwebtoken'
import { ChallengeData } from '../types';

export const parseSignedStatement = (signedStatement: string) => {
  const parts = signedStatement.split(' ');
  // console.log('parsed parts', parts)
  // TODO check length and throw
  let username = parts[3];
  // TODO only remove if necessary
  username = username.substring(1); // remove @
  const address = parts[10].trim().slice(0, -1); // remove .
  const statement = parts.slice(0, 11).join(' ');
  const signature = parts[11].trim();
  const url = parts[12];
  return {
    username,
    address,
    statement,
    signature,
    url
  };
}

export const createProofStatement = (uuid: string, address: string, channel = 'Twitter') => {
  if (!address) {
    throw new Error('Cannot construct statement - address is undefined')
  }
  return `Verifying myself: I'm ${uuid} on ${channel} and own Ethereum address ${address}.`
}

export const verifyProof = async (username: string, address: string, channel = 'Twitter', signature: string) => {
  const originalMessage = createProofStatement(username, address, channel)
  return verifyMessage(originalMessage, signature)
}

export const verifyMessage = async (originalMessage: string, signature: string) => {
  const recoveredAddress = ethers.utils.verifyMessage(originalMessage, signature)
  return {
    recoveredAddress
  }
}

export const decodeChallengeToken = (token: string) => {
  return jwt.decode(token)
}

export const createChallengeToken = async (payload: ChallengeData, secret: string) => {

  let signedToken = jwt.sign(payload, secret, {
    expiresIn: 60 * 60
  })
  // sign to know that challenge was indeed from server
  return signedToken
}
