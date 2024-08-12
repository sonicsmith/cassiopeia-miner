import { findHashForBlock } from "./miningUtils";
import { getChallengeNumber, getMiningTarget } from "./tokenUtils";

import dotenv from "dotenv";
dotenv.config();

const account = process.env.ACCOUNT as `0x${string}`;
if (!account) {
  throw new Error("ACCOUNT is required");
}

const beginMining = async () => {
  while (true) {
    console.log("Trying new block");
    const challengeNumber = await getChallengeNumber();
    const miningTarget = await getMiningTarget();
    console.log("Challenge Number:", challengeNumber);
    console.log("Mining Target:", miningTarget);

    const result = await findHashForBlock({
      account,
      challengeNumber,
      miningTarget,
    });

    if (result) {
      console.log("Minted Block!!!");
      break;
    }
  }
};

beginMining();
