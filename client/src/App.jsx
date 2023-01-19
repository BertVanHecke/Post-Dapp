import { EthProvider } from "./contexts/EthContext";
import NavBar from "./components/NavBar";
import "./App.css";

function App() {
  return (
    <EthProvider>
      <div id="App">
        <NavBar />
      </div>
    </EthProvider>
  );
}

export default App;
