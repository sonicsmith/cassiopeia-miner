import { useEffect, useMemo, useState } from "react";
import { ConnectKitButton } from "connectkit";
import { useAccount, useBalance } from "wagmi";
import { Button } from "./ui/button";
import { MiningAnimation } from "./MiningAnimation";
import { Loader2 } from "lucide-react";

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
  const [minting, setMinting] = useState(false);

  const { mintToken, status, data, error } = useMintToken();
  console.log("useMintToken", { status, data, error });

  useEffect(() => {
    const _worker = new MiningWorker();
    _worker.onmessage = (event) => {
      setMining(false);
      console.log("Received result from worker:", event.data);
      const miningResult: MiningResult = event.data;
      if (miningResult?.hash) {
        setResult(event.data);
      }
    };
    setWorker(_worker);
    return () => {
      _worker.terminate();
    };
  }, []);

  const { address, chainId } = useAccount();

  const ethBalance = useBalance({
    address,
  });

  const hasEnoughGas = useMemo(() => {
    if (ethBalance.data && ethBalance.data.value < BigInt(5000000000000)) {
      return false;
    }
    return true;
  }, [ethBalance.data]);

  useEffect(() => {
    if (status === "success" && data) {
      window.location.href = `https://basescan.org/tx/${data}`;
    }
    if (status === "error") {
      setMinting(false);
    }
  }, [data, status]);

  const mintTokenWithHash = () => {
    if (result) {
      setMinting(true);
      mintToken(result);
    }
  };

  const toggleMining = () => {
    if (worker && address) {
      if (mining) {
        console.log("Stopping mining...");
        worker.terminate();
        const _worker = new MiningWorker();
        _worker.onmessage = (event) => {
          setMining(false);
          console.log("Received result from worker:", event.data);
          const miningResult: MiningResult = event.data;
          if (miningResult?.hash) {
            setResult(event.data);
          }
        };
        setWorker(_worker);
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
            disabled={minting ?? chainId !== 8453}
          >
            {minting && <Loader2 className="animate-spin w-5 h-5 mr-2" />}
            {minting ? "Minting" : "Mint Token"}
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
      {chainId !== 8453 && (
        <div className="mt-12 border rounded-xl bg-red-100 w-fit p-4 m-auto">
          <span className="font-serif mr-2">⚠️</span>
          Switch to Base Network
        </div>
      )}
    </div>
  );
};
