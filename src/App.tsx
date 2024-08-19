import "./App.css";

import { Web3Provider } from "./Web3Provider";
import { MiningPanel } from "./components/MiningPanel";

function App() {
  return (
    <Web3Provider>
      <div className="mb-12">
        <div className="text-3xl">Cassiopeia Miner</div>
        <a
          className="text-blue-800 hover:underline"
          href="https://opensea.io/collection/cassiopeia-404"
        >
          (View Collection on OpenSea)
        </a>
      </div>
      <MiningPanel />
    </Web3Provider>
  );
}

export default App;
