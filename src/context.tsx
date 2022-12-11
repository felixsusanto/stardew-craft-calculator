import React from 'react';

export type InitialData = {
  label: string;
  goal: number;
  possession: number;
};

export type DataContextType = {
  initData?: InitialData[];
};

const DataContext = React.createContext<DataContextType>({} as DataContextType);

export default DataContext;
