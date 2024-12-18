import React, { createContext, useState, useContext } from 'react';

const FormContext = createContext();

export const useFormContext = () => useContext(FormContext);

export const FormProvider = ({ children }) => {
  const [box1Items, setBox1Items] = useState([
    { id: 1, text: 'Email' },
    { id: 2, text: 'Password' },
  ]);
  const [box2Items, setBox2Items] = useState([
    { id: 3, text: 'Username' },
    { id: 4, text: 'Full Name' },
    { id: 5, text: 'Confirm Password' },
  ]);

  return (
    <FormContext.Provider value={{ box1Items, setBox1Items, box2Items, setBox2Items }}>
      {children}
    </FormContext.Provider>
  );
};
