import "./App.css";

import { Web3Provider } from "./Web3Provider";
import { MiningPanel } from "./components/MiningPanel";

function App() {
  return (
    <Web3Provider>
      <div className="text-3xl mb-12">Cassiopeia Miner</div>
      <MiningPanel />
    </Web3Provider>
  );
}

export default App;
