import React from 'react';
import Box from './Box';
import '../styles/Form.css';

const Form = () => {
  return (
    <div className="form-container">
      <div className="form-box">
        <Box boxName="box1" />
      </div>
      <div className="form-box">
        <Box boxName="box2" />
      </div>
      
    </div>
  );
};

export default Form;
