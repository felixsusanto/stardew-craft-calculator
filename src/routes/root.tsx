import React, { useState } from 'react';
import _ from 'lodash';
import CssBaseline from '@mui/material/CssBaseline';
import craftableCsv, { CraftableBase, Material } from '../csv/craftables.csv';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CraftableComponent, { zeroMask } from '../components/CraftableComponent';
import TotalMaterial from '../components/TotalMaterial';
import DataContext, { DataContextType, InitialData } from '../context/InitialDataContext';
import CalculatorConfigContext, { CalculatorConfigType, CalculatorConfig, Season, Year } from '../context/CalculatorConfigContext';
import { Box } from '@mui/material';
import styled from 'styled-components';
import Footer from '../components/Footer';
import Fab from '@mui/material/Fab';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import Header from '../components/Header'; 
import mainLogo from '../assets/main_logo.png';
import CraftableSprite from '../components/CraftableSprite';
import { Outlet } from "react-router-dom";
import NavBar from '../components/NavBar';

export type Craftable = CraftableBase & Material;
const CssTextField = styled(TextField)({
  '& label.Mui-focused': {
    color: '#fff',
  },
  '& .MuiFormLabel-root': {
    color: 'rgba(255,255,255,0.6)',
  },
  '& .MuiInputBase-input': {
    color: '#fff'
  },
  '& .MuiOutlinedInput-root': {
    '& fieldset': {
      borderColor: 'rgba(255,255,255,0.6)',
    },
    '&:hover fieldset': {
      borderColor: '#fff',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#fff',
    },
  },
  '& .MuiSvgIcon-root': {
    fill: '#fff'
  }
});

export const Container = styled.div`
  max-width: 700px;
  padding: 0 20px;
  margin: 0 auto;
`;
const ThreeRowFlex = styled.div`
  display: flex;
  min-height: 100vh;
  flex-direction: column;
  .mid {
    flex: 1;
  }
`;

const Splash = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);
  text-align: center;
  color: #fff;
  img {
    max-width: 100%;
    margin-bottom: 5%;
  }
  .title {
    font-size: 1vw;
    font-size: clamp(0.5rem, 3vw + 0.5rem, 2rem);
    margin-bottom: 0.5em;
    line-height: 1;
  }
`;

const defaultConfigValue = {
  season: Season.EMPTY,
  year: Year.EMPTY
};

console.log(craftableCsv);

function App() {
  const calculateRef = React.useRef(new Map<string, Material>());
  const initDataRef = React.useRef(new Map<string, InitialData>());
  const [craftable, setCraftable] = useState<Craftable[]>();
  const [filter, setFilter] = useState<string[]>([]);
  const [recalculate, setRecalculate] = useState<boolean>();
  const [total, setTotal] = useState<Material>();
  const [ctx, setCtx] = useState<DataContextType>({});
  const [config, setConfig] = useState<CalculatorConfig>();

  React.useEffect(() => {
    const craftable: Craftable[] = craftableCsv;
    setCraftable(craftable);
    const existingInitData  = window.localStorage.getItem('initData');
    const existingConfigData  = window.localStorage.getItem('configData');
    const initDataContext = (existingInitData ? JSON.parse(existingInitData) : []) as InitialData[];
    const initConfigDataContext = (
      existingConfigData ? 
      JSON.parse(existingConfigData) : defaultConfigValue
      ) as CalculatorConfig
    ;
    setCtx({ initData: initDataContext });
    setConfig(initConfigDataContext);
  }, []);

  React.useEffect(() => {
    if (ctx.initData) {
      const filter = ctx.initData.map((item) => item.label);
      setFilter(filter);
    }
  }, [ctx]);

  React.useEffect(() => {
    if (typeof config === 'undefined') return;
    window.localStorage.setItem('configData', JSON.stringify(config));
  }, [config]);

  React.useEffect(() => {
    if (typeof recalculate === 'undefined') return;
    const total = [...calculateRef.current.values()]
      .reduce((acc, curr) => {
        Object.keys(curr)
          .forEach((key) => {
            const accVal = acc[key];
            const currVal = curr[key];
            if (!isNaN(currVal)) {
              if (!accVal) {
                acc[key] = currVal;
              } else {
                acc[key] = accVal + currVal;
              }
            }
          })
        ;
        return acc;
      }, {})
    ;
    setTotal(total);
    const t = [...initDataRef.current.values()];
    window.localStorage.setItem('initData', JSON.stringify(t));
  }, [recalculate]);
  
  return (
    <DataContext.Provider value={ctx}>
      <CssBaseline />
      <CalculatorConfigContext.Provider 
        value={{
          config,
          setConfig: (partialCfg) => {
            setConfig((curr) => {
              return {...defaultConfigValue, ...curr, ...partialCfg};
            });
          }
        }}
      >
        <ThreeRowFlex>
          <NavBar />
          <div className="mid">
            <Outlet />
          </div>
          <Footer />
        </ThreeRowFlex>
      </CalculatorConfigContext.Provider>
      
      <div style={{ position: 'fixed', right: 20, bottom: 20}}>
        <Fab color="primary" aria-label="add">
          <ArrowUpwardIcon />
        </Fab>
      </div>
    </DataContext.Provider>
  )
}

export default App
