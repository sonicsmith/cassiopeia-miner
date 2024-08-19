import { useEffect, useMemo, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount, useBalance } from "wagmi";
import { Button } from "./ui/button";
import { MiningAnimation } from "./MiningAnimation";

import MiningWorker from "./../lib/worker?worker";
import { useMintToken } from "../hooks/useMintToken";

export type MiningResult = {
  nonce: bigint;
  hash: `0x${string}`;
} | null;

export const MiningPanel = () => {
  const [worker, setWorker] = useState<Worker | null>(null);
  const [result, setResult] = useState<MiningResult>(null);
  const [mining, setMining] = useState(false);

  const { mintToken, status, data, error } = useMintToken();
  console.log("useMintToken", { status, data, error });

  useEffect(() => {
    const _worker = new MiningWorker();
    _worker.onmessage = (event) => {
      setMining(false);
      console.log("Received result from worker:", event.data);
      const miningResult: MiningResult = event.data;
      if (miningResult?.hash) {
        // mintToken(miningResult);
        setResult(event.data);
      }
    };
    setWorker(_worker);
    return () => {
      _worker.terminate();
    };
  }, []);

  const { address } = useAccount();

  const ethBalance = useBalance({
    address,
  });

  const hasEnoughGas = useMemo(() => {
    if (ethBalance.data && ethBalance.data.value < BigInt(5000000000000)) {
      return false;
    }
    return true;
  }, []);

  const mintTokenWithHash = () => {
    if (result) {
      mintToken(result);
    }
  };

  const toggleMining = () => {
    if (worker && address) {
      if (mining) {
        console.log("Stopping mining...");
        worker.postMessage("stop");
      } else {
        console.log("Starting mining...");
        setResult(null);
        worker.postMessage(address);
      }
      setMining(!mining);
    }
  };

  console.log("Mining Result", result);

  console.log("ETH Balance", ethBalance);

  return (
    <div className="">
      <div>
        {!address && (
          <div className="mt-4">
            <p className="font-bold text-lg">
              Connect your wallet to begin mining.
            </p>
            <p className="text-gray-500">
              (You will need a small amount of ETH on Base to cover gas of
              minting)
            </p>
          </div>
        )}
        <div className="mx-auto mt-5 w-fit">
          <ConnectKitButton />
        </div>
      </div>
      <div className="pt-16 w-full">{mining && <MiningAnimation />}</div>
      {result && !mining && (
        <div className="m-auto">
          <div className="font-bold text-lg mb-3">Found Solution!</div>
          <div className="font-bold">Hash:</div> {result.hash}
          <div>
            <div className="font-bold">Nonce:</div>
            {result.nonce.toString()}
          </div>
          <Button
            onClick={mintTokenWithHash}
            className="mt-4"
            variant={"destructive"}
          >
            Mint Token
          </Button>
        </div>
      )}
      {address && !result && (
        <div className="mt-6">
          <Button onClick={toggleMining}>
            {mining ? "Stop Mining" : "Start Mining"}
          </Button>
        </div>
      )}
      {!hasEnoughGas && (
        <div className="mt-12 border rounded-xl bg-red-100 w-fit p-4 m-auto">
          <span className="font-serif mr-2">⚠️</span>You only have{" "}
          {ethBalance.data?.formatted} ETH on Base.
          <p>We recommend at least 0.000005 to cover gas.</p>
        </div>
      )}
    </div>
  );
};
