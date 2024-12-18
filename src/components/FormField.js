import React from 'react';
import '../styles/FormField.css';

const FormField = ({ field, handleDragStart }) => {
  return (
    <li
      key={field.id}
      draggable
      onDragStart={(e) => handleDragStart(e, field)}
      className="form-field"
    >
      <label>{field.text}</label>
      <input type="text" placeholder={`Enter ${field.text}`} />
    </li>
  );
};

export default FormField;
