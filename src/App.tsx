import "./App.css";

import { Web3Provider } from "./Web3Provider";
import { MiningPanel } from "./components/MiningPanel";

function App() {
  return (
    <Web3Provider>
      <MiningPanel />
    </Web3Provider>
  );
}

export default App;
