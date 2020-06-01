import React from "react";
import logo from "./logo.svg";
import "./App.css";
import Map from "./Map";
import PostCodes from "./PostCodes";

function App() {
  return (
    <div className="App" style={{ minWidth: "100vw", minHeight: "100vh" }}>
      <Map />
      <PostCodes />
    </div>
  );
}

export default App;
