import { encodeAbiParameters, keccak256 } from "viem";
import { mintBlock } from "./tokenUtils";

export const getHash = ({
  accountAddress,
  challengeNumber,
  nonce,
}: {
  accountAddress: `0x${string}`;
  challengeNumber: `0x${string}`;
  nonce: bigint;
}) => {
  const abiEncoded = encodeAbiParameters(
    [
      { name: "challengeNumber", type: "bytes32" },
      { name: "account", type: "address" },
      { name: "nonce", type: "uint256" },
    ],
    [challengeNumber, accountAddress, nonce]
  );
  const digest = keccak256(abiEncoded);
  return digest;
};

const SECOND = 1_000;
const BLOCK_TIME = 30 * 60 * SECOND; // 30 minutes

export const findHashForBlock = ({
  accountAddress,
  challengeNumber,
  miningTarget,
}: {
  accountAddress: `0x${string}`;
  challengeNumber: `0x${string}`;
  miningTarget: bigint;
}) => {
  let nonce = BigInt(0);
  const startTime = Date.now();
  let timeSpent = 0;
  let hash: `0x${string}` = `0x0`;

  while (timeSpent < BLOCK_TIME) {
    hash = getHash({
      accountAddress,
      challengeNumber,
      nonce,
    });

    if (BigInt(hash) < miningTarget) {
      break;
    } else {
      nonce++;
    }

    timeSpent = Date.now() - startTime;
  }

  if (timeSpent < BLOCK_TIME) {
    console.log("Block found:", { nonce, hash });
    return mintBlock({ nonce, hash });
  } else {
    return null;
  }
};
