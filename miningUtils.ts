import { encodeAbiParameters, keccak256 } from "viem";
import { mintBlock } from "./tokenUtils";

export const getHash = ({
  account,
  challengeNumber,
  nonce,
}: {
  account: `0x${string}`;
  challengeNumber: `0x${string}`;
  nonce: bigint;
}) => {
  const abiEncoded = encodeAbiParameters(
    [
      { name: "challengeNumber", type: "bytes32" },
      { name: "account", type: "address" },
      { name: "nonce", type: "uint256" },
    ],
    [challengeNumber, account, nonce]
  );
  const digest = keccak256(abiEncoded);
  return digest;
};

const SECOND = 1_000;
const BLOCK_TIME = 30 * 60 * SECOND; // 30 minutes

export const findHashForBlock = ({
  account,
  challengeNumber,
  miningTarget,
}: {
  account: `0x${string}`;
  challengeNumber: `0x${string}`;
  miningTarget: bigint;
}) => {
  let nonce = BigInt(0);
  const startTime = Date.now();
  let timeSpent = 0;
  let hash: `0x${string}` = `0x0`;

  while (timeSpent < BLOCK_TIME) {
    hash = getHash({
      account,
      challengeNumber,
      nonce,
    });

    if (BigInt(hash) < miningTarget) {
      break;
    } else {
      nonce++;
    }

    timeSpent = Date.now() - startTime;
    // if (timeSpent % (5 * SECOND) === 0) {
    //   console.log("Nonce:", nonce.toString());
    // }
  }

  if (timeSpent < BLOCK_TIME) {
    console.log({ nonce, hash });
    return mintBlock({ nonce, hash });
  } else {
    return null;
  }
};
