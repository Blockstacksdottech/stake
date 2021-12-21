import React from 'react';
import Staking from './components/Staking';
import {
  BrowserRouter,
  Routes,
  Route
} from "react-router-dom";
import Swap from './components/Swap';


function App() {
  return (
    <BrowserRouter>
    <Routes>
      <Route path="/" element={<Staking current="stake" />} />
      <Route path="/swap" element={<Swap current="swap" />} />
    </Routes>
  </BrowserRouter>
    
  );
}

export default App;
