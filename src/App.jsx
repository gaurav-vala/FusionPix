import { useState } from "react";
import reactLogo from "./assets/react.svg";
import viteLogo from "/vite.svg";
import "./App.css";

function App() {
  const [count, setCount] = useState(0);

  return (
    <>
      <h1>Test For Template</h1>

      <button className="btn btn-outline-primary mt-10">Test</button>
    </>
  );
}

export default App;
