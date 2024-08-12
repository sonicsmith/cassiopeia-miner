import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

import dotenv from "dotenv";
dotenv.config();

const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
if (!privateKey) {
  throw new Error("PRIVATE_KEY is required");
}

const rpcUrl = process.env.RPC_URL;

const account = privateKeyToAccount(privateKey);

export const client = createWalletClient({
  account,
  chain: base,
  transport: http(rpcUrl),
});
