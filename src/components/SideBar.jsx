import { invoke } from '@tauri-apps/api/tauri';
import React, { useState, useEffect } from 'react';
import MathInput from './MathInput';
import { MdAdd } from 'react-icons/md';
import GraphColors from '../utils/graphColors';

import '../styles/SideBar.css';

const SideBar = () => {
  const [expressions, setExpressions] = useState([]);
  const [nextId, setNextId] = useState(0);

  const createNewMathInput = () => {
    var color = GraphColors[nextId % (GraphColors.length - 1)];
    invoke('create_new_expression', { id: nextId, color: color });
    setNextId((currentId) => currentId + 1);

    invoke('get_expressions').then((exprs) => {
      exprs.sort((a, b) => a.id - b.id);
      setExpressions(exprs);
    });
  };

  const deleteCallback = (id) => {
    invoke('delete_expression', { id: id });

    invoke('get_expressions').then((exprs) => {
      exprs.sort((a, b) => a.id - b.id);
      setExpressions(exprs);

      if (exprs.length === 0) createNewMathInput();
    });
  };

  useEffect(() => {
    invoke('clear_expressions');
    createNewMathInput();
  }, []);

  return (
    <div className='side-bar-container'>
      {expressions.map((expr) => {
        const { id, latex, color } = expr;

        return <MathInput key={id} id={id} latex={latex} deleteCallback={deleteCallback} color={color} />;
      })}

      <div className='add-button'>
        <MdAdd size={36} onClick={createNewMathInput} />
      </div>
    </div>
  );
};

export default SideBar;
