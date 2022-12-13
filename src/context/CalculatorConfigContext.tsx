import React from 'react';

export enum Season {
  EMPTY = 'unspecified',
  SPRING = 'spring',
  SUMMER = 'summer',
  FALL = 'fall',
  WINTER = 'winter',
};

export enum Year {
  EMPTY = 'UNSPECIFIED',
  ONE = 'ONE',
  TWO_PLUS = 'TWO_PLUS',
};

export type CalculatorConfig = {
  season: Season;
  year: Year;
};

export type CalculatorConfigType = {
  config: CalculatorConfig;
  setConfig: (newConfig: Partial<CalculatorConfig>) => void;
};

const CalculatorConfigContext = React.createContext<CalculatorConfigType>({} as CalculatorConfigType);

export default CalculatorConfigContext;
