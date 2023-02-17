import React from 'react';

export type InitialData = {
  label: string;
  goal: number;
  possession: number;
};

export type InventoryData = {
  name: string;
  qty: string;
};

export type DataContextType = {
  initData?: InitialData[];
  inventory?: InventoryData[];
};

const DataContext = React.createContext<DataContextType>({} as DataContextType);

export default DataContext;
