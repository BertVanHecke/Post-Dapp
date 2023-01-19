import { EthProvider } from "./contexts/EthContext";
import NavBar from "./components/NavBar";
import PostForm from "./components/PostForm";
import "./App.css";
import Feed from "./components/Feed";

function App() {
  return (
    <EthProvider>
      <div id="App">
        <NavBar />
        <PostForm />
        <Feed />
      </div>
    </EthProvider>
  );
}

export default App;
