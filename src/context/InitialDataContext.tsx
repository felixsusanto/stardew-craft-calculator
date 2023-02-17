import React from 'react';

export type InitialData = {
  label: string;
  goal: number;
  possession: number;
};

export type InventoryData = {
  name: string;
  qty: number;
};

export type DataContextType = {
  initData?: InitialData[];
  inventory?: InventoryData[];
  setInventory: (v: InventoryData[]) => void;
};

const DataContext = React.createContext<DataContextType>({} as DataContextType);

export default DataContext;
