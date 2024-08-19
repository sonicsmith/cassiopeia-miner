import { createPublicClient, http } from "viem";
import { base } from "viem/chains";
import { parseAbi } from "viem";
import { readContract } from "viem/actions";
import { encodeAbiParameters, keccak256 } from "viem";
import { TOKEN_ADDRESS } from "../constants";

const client = createPublicClient({
  chain: base,
  transport: http(),
});

const getChallengeNumber = () => {
  return readContract(client, {
    abi: parseAbi([
      "function getChallengeNumber() public view returns (bytes32)",
    ]),
    address: TOKEN_ADDRESS,
    functionName: "getChallengeNumber",
    args: [],
  });
};

const getMiningTarget = () => {
  return readContract(client, {
    abi: parseAbi(["function getMiningTarget() public view returns (uint256)"]),
    address: TOKEN_ADDRESS,
    functionName: "getMiningTarget",
    args: [],
  });
};

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
  let nonce = 15682091n; //BigInt(0);
  const startTime = Date.now();
  let timeSpent = 0;
  let hash: `0x${string}` = `0x0`;

  console.log("Hashing...");

  while (timeSpent < BLOCK_TIME) {
    hash = getHash({
      accountAddress,
      challengeNumber,
      nonce,
    });

    if (BigInt(hash) <= miningTarget) {
      break;
    } else {
      nonce++;
    }

    timeSpent = Date.now() - startTime;
  }

  if (timeSpent < BLOCK_TIME) {
    return { nonce, hash };
  } else {
    return null;
  }
};

const mineBlock = async (address: string) => {
  const challengeNumber = await getChallengeNumber();
  const miningTarget = await getMiningTarget();
  console.log("Challenge Number:", challengeNumber);
  console.log("Mining Target:", miningTarget);
  console.log("Finding Hash For Block:");
  const result = await findHashForBlock({
    accountAddress: address as `0x${string}`,
    challengeNumber,
    miningTarget,
  });
  return result;
};

onmessage = async (event: MessageEvent) => {
  console.log("Received message:", event.data);

  if (event.data === "stop") {
    // TODO: How to stop mining?
    return;
  }

  const beginMining = async (address: string) => {
    console.log("Mining:");
    const result = await mineBlock(address);
    postMessage(result);
  };

  beginMining(event.data);
};
