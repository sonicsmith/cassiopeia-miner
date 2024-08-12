import { parseAbi } from "viem";
import { readContract, writeContract } from "viem/actions";
import { client } from "./walletConnection";

const tokenAddress = "0xb17c8a3fad09c1ec2759b480349e48bfff37adb7"; // Cassiopeia Token Address on Base

export const getChallengeNumber = () => {
  return readContract(client, {
    abi: parseAbi([
      "function getChallengeNumber() public view returns (bytes32)",
    ]),
    address: tokenAddress,
    functionName: "getChallengeNumber",
    args: [],
  });
};

export const getMiningTarget = () => {
  return readContract(client, {
    abi: parseAbi(["function getMiningTarget() public view returns (uint256)"]),
    address: tokenAddress,
    functionName: "getMiningTarget",
    args: [],
  });
};

export const mintBlock = ({
  nonce,
  hash,
}: {
  nonce: bigint;
  hash: `0x${string}`;
}) => {
  return writeContract(client, {
    abi: parseAbi([
      "function mint(uint256 nonce, bytes32 challengeDigest) public returns (bool success)",
    ]),
    address: tokenAddress,
    functionName: "mint",
    args: [nonce, hash],
  });
};
