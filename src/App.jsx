import React, { useState } from 'react';
import GraphCanvas from './components/GraphCanvas';
import SideBar from './components/SideBar';
import './styles/main.css';
import './styles/globals.css';

function App() {
  const [forceRerender, setForceRerender] = useState(false);

  return (
    <>
      <SideBar setForceRerender={setForceRerender} />
      <GraphCanvas forceRerender={forceRerender} />
    </>
  );
}

export default App;
