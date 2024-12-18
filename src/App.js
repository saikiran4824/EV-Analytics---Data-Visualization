import React from 'react';
import './styles/App.css';
import { FormProvider } from './context/FormContext';
import Header from './components/Header';
import Form from './components/Form';

const App = () => {
  return (
    <FormProvider>
      <div className="app">
        <Header />
        <Form />
      </div>
    </FormProvider>
  );
};

export default App;
