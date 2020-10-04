import { createContext } from 'react';
import React, { useContext } from 'react';
import useKeyword from './hook/keyword';

const Master = createContext(null);

function DataViewer({ children }) {
  const { TextFieldRef, searchKeyword, setSearchKeyword } = useKeyword();
  return (
    <Master.Provider value={{ TextFieldRef, searchKeyword, setSearchKeyword }}>
      {children}
    </Master.Provider>
  );
}

export { Master, DataViewer };

