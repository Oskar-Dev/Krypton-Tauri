import React, { useEffect, useState } from 'react';
import { BsGearFill, BsGear } from 'react-icons/bs';
import { MdClear } from 'react-icons/md';
import { parseLatex } from '../utils/parseLatex';

import '../jquery/jquery.min.js';
import '../mathquill-0.10.1/mathquill.min.js';

import '../mathquill-0.10.1/mathquill.css';
import '../styles/MathInput.css';
import { invoke } from '@tauri-apps/api';

const MathInput = ({ id, latex, deleteCallback }) => {
  const [focus, setFocus] = useState(false);

  useEffect(() => {
    var MQ = MathQuill.getInterface(2);
    var mathFieldSpan = document.getElementById(id);
    var mathField = MQ.MathField(mathFieldSpan, {
      // spaceBehavesLikeTab: true, // configurable
      restrictMismatchedBrackets: true,
      charsThatBreakOutOfSupSub: '+-',
      autoCommands: 'pi phi sqrt',
      autoOperatorNames: 'sin cos tg tan ctg cot cosec csc sec log ln abs sm',
      handlers: {
        edit: () => {
          var latex = mathField.latex();
          var parsedLatex = parseLatex(latex);

          invoke('handle_input_change', { id: id, newParsedInput: parsedLatex });
        },
      },
    });
  }, []);

  useEffect(() => {
    var MQ = MathQuill.getInterface(2);
    var mathFieldSpan = document.getElementById(id);
    var mathField = MQ.MathField(mathFieldSpan);

    if (latex === undefined) mathField.latex('\\vphantom');
    else mathField.latex(latex);
  }, [latex]);

  return (
    <div className={`input-container ${focus ? 'focus' : ''}`} id={`input-container-${id}`}>
      <div className='delete-button button-wrapper'>
        <MdClear className='icon' size={36} onClick={() => deleteCallback(id)} />
      </div>

      <div className={`math-field-wrapper ${focus ? 'focus' : ''}`}>
        <span
          id={id}
          className='math-field'
          tabIndex={0}
          onFocus={() => {
            setFocus(true);
          }}
          onBlur={() => setFocus(false)}
        ></span>
      </div>

      <div className='box'>
        <div className='settings-button'>
          <BsGear
            className='icon'
            color={/*settings.color*/ '#b4202a'}
            size={24}
            onClick={() => {
              toggleSettings();
            }}
          />
          <BsGearFill className='icon-fill' color={/*settings.color*/ '#b4202a' + '3C'} size={24} />
        </div>
      </div>
    </div>
  );
};

export default MathInput;
