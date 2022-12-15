import React from 'react';
import GraphCanvas from './components/GraphCanvas';
import SideBar from './components/SideBar';
import './styles/main.css';
import './styles/globals.css';

function App() {
  return (
    <>
      <SideBar />
      <GraphCanvas />
    </>
  );
}

export default App;
