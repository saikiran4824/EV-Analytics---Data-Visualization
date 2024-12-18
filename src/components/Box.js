import React from 'react';
import { useFormContext } from '../context/FormContext';
import FormField from './FormField';
import '../styles/Box.css';

const Box = ({ boxName }) => {
  const { box1Items, setBox1Items, box2Items, setBox2Items } = useFormContext();

  const handleDragStart = (e, item) => {
    e.dataTransfer.setData('text/plain', JSON.stringify(item));
  };

  const handleDrop = (e, targetBox) => {
    e.preventDefault();
    const droppedItem = JSON.parse(e.dataTransfer.getData('text/plain'));

    if (targetBox === 'box1') {
      let isSameItemPresent = box1Items.some(item => item.id === droppedItem.id);
      if (!isSameItemPresent) {
        setBox1Items([...box1Items, droppedItem]);
        setBox2Items(box2Items.filter(item => item.id !== droppedItem.id));
      }
    } else if (targetBox === 'box2') {
      let isSameItemPresent = box2Items.some(item => item.id === droppedItem.id);
      if (!isSameItemPresent) {
        setBox2Items([...box2Items, droppedItem]);
        setBox1Items(box1Items.filter(item => item.id !== droppedItem.id));
      }
    }
  };

  const items = boxName === 'box1' ? box1Items : box2Items;

  return (
    <div className="box" onDragOver={(e) => e.preventDefault()} onDrop={(e) => handleDrop(e, boxName)}>
      <h3>{boxName === 'box1' ? 'Login Form' : 'Registration Form'}</h3>
      <ul>
        {items.map((item) => (
          <FormField key={item.id} field={item} handleDragStart={handleDragStart} />
        ))}
      </ul>
    </div>
  );
};

export default Box;
