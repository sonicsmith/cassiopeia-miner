import { parseAbi } from "viem";
import { useWriteContract } from "wagmi";
import { TOKEN_ADDRESS } from "../constants";

export const useMintToken = () => {
  const { writeContract, status, data, error } = useWriteContract();

  const mintToken = ({
    nonce,
    hash,
  }: {
    nonce: bigint;
    hash: `0x${string}`;
  }) => {
    writeContract({
      abi: parseAbi([
        "function mint(uint256 nonce, bytes32 challengeDigest) public returns (bool success)",
      ]),
      address: TOKEN_ADDRESS,
      functionName: "mint",
      args: [nonce, hash],
    });
  };

  return { mintToken, status, data, error };
};
