import React from 'react';

export interface BaseInitData {
  label: string;
  goal: number;
  possession: number;
}

export type InitialData = ({
  type: undefined;
} & BaseInitData) | ({
  type: 'goal';
  meta: Record<string, any>;
} & BaseInitData);

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
