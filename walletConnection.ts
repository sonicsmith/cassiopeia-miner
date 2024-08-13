import { createWalletClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { base } from "viem/chains";

const privateKey = process.env.PRIVATE_KEY as `0x${string}`;
if (!privateKey) {
  throw new Error("PRIVATE_KEY is required");
}

const account = privateKeyToAccount(privateKey);

const rpcUrl = process.env.RPC_URL;

export const client = createWalletClient({
  account,
  chain: base,
  transport: http(rpcUrl),
});
