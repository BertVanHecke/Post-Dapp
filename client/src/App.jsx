import React, { useState } from "react";
import { EthProvider } from "./contexts/EthContext";
import NavBar from "./components/NavBar";
import Feed from "./components/Feed";
import Modal from "./components/Modal";
import Footer from "./components/Footer";
import "./App.css";

function App() {
  const [open, setOpen] = useState(false);

  return (
    <EthProvider>
      <div id="App">
        <NavBar setOpen={setOpen} />
        <Modal open={open} setOpen={setOpen} />
        <Feed />
        <Footer />
      </div>
    </EthProvider>
  );
}

export default App;
