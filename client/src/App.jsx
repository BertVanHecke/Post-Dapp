import React, { useState } from "react";
import { EthProvider } from "./contexts/EthContext";
import NavBar from "./components/NavBar";
import "./App.css";
import Feed from "./components/Feed";
import Modal from "./components/Modal";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <EthProvider>
      <div id="App">
        <NavBar setOpen={setOpen} />
        <Modal open={open} setOpen={setOpen} />
        <Feed />
      </div>
    </EthProvider>
  );
}

export default App;
