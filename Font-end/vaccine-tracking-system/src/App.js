// src/App.js
import './App.css';
import { Routes, Route } from "react-router-dom";
import Test from './Test';



function App() {
  return (
    <>
      <Test />
      <Routes>
        {/* <Route path="/" element={<Test />} /> */}
      </Routes>
    </>
  );
}

export default App;
