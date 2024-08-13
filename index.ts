import dotenv from "dotenv";
dotenv.config();

import { findHashForBlock } from "./miningUtils";
import { getChallengeNumber, getMiningTarget } from "./tokenUtils";
import { privateKeyToAccount } from "viem/accounts";

const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
if (!privateKey) {
  throw new Error("PRIVATE_KEY is required");
}

const account = privateKeyToAccount(privateKey);
const accountAddress = account.address;

const beginMining = async () => {
  while (true) {
    console.log();
    console.log("Getting new block...");
    const challengeNumber = await getChallengeNumber();
    const miningTarget = await getMiningTarget();
    // console.log("Hashing...");
    console.log();
    const result = await findHashForBlock({
      accountAddress,
      challengeNumber,
      miningTarget,
    });

    if (result) {
      console.log("Minted Block!!!");
    }
  }
};

beginMining();
