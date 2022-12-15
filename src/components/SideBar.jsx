import React from 'react';
import '../styles/SideBar.css';
import './MathInput';
import MathInput from './MathInput';

const SideBar = () => {
  return (
    <div className='side-bar-container'>
      <MathInput id={1} />
    </div>
  );
};

export default SideBar;
