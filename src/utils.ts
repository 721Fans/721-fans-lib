import { ethers } from "ethers";

export const sleep = (t = 2000) => new Promise((resolve, reject) => {
  setTimeout(resolve, t);
});

export function getRandomInt(min: number, max: number) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
}

export const isValidEthereumAddress = (address: string) => {
  try {
    ethers.utils.getAddress(address);
    return true;
  }
  catch {
    return false;
  }
};