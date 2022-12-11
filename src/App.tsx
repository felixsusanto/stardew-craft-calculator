import React, { useState } from 'react';
import _ from 'lodash';
import CssBaseline from '@mui/material/CssBaseline';
import craftableCsv from './csv/craftables.csv';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CraftableComponent from './components/CraftableComponent';
import Container from '@mui/material/Container';
import TotalMaterial from './components/TotalMaterial';
import DataContext, { DataContextType, InitialData } from './context';

export interface CraftableBase {
  id: number;
  label: string;
}

export type Material = Record<string, number>;
export type Craftable = CraftableBase & Material;



function App() {
  const calculateRef = React.useRef(new Map<string, Material>());
  const initDataRef = React.useRef(new Map<string, InitialData>());
  const [craftable, setCraftable] = useState<Craftable[]>();
  const [filter, setFilter] = useState<string[]>([]);
  const [recalculate, setRecalculate] = useState<boolean>();
  const [total, setTotal] = useState<Material>();
  const [ctx, setCtx] = useState<DataContextType>({});
  React.useEffect(() => {
    const craftable: Craftable[] = craftableCsv;
    setCraftable(craftable);
    const existingData  = window.localStorage.getItem('initData');
    const initDataContext = (existingData ? JSON.parse(existingData) : []) as InitialData[];
    setCtx({ initData: initDataContext });
  }, []);

  React.useEffect(() => {
    if (ctx.initData) {
      const filter = ctx.initData.map((item) => item.label);
      setFilter(filter);
    }
  }, [ctx]);

  React.useEffect(() => {
    if (typeof recalculate === 'undefined') return;
    const total = [...calculateRef.current.values()]
      .reduce((acc, curr) => {
        Object.keys(curr)
          .forEach((key) => {
            const accVal = acc[key];
            const currVal = curr[key];
            if (!accVal) {
              acc[key] = currVal;
            } else {
              acc[key] = accVal + currVal;
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
      <Container maxWidth="sm">
        <div className="App">
          <Autocomplete<Craftable>
            options={craftableCsv}
            sx={{mt: 3, mb: 3}}
            onChange={(e, v) => {
              v && setFilter((filterArr) => {
                if (!filterArr.some(val => v.label === val)) {
                  return [...filterArr, v.label];
                }
                return filterArr;
              });
            }}
            renderInput={(params) => <TextField {...params} size="small" label="Add Craftables" />}
          />
          <TotalMaterial total={_.omitBy(total, (v) => v === 0)} />
          
          <div className="card">
            { filter.map((label) => {
              if (!craftable) return null;
              const craft = _.find(craftable, { label }) as Craftable;
              if (!craft) return null;
              const {id, label: name, ...rest} = craft;
              return (
                <CraftableComponent 
                  key={id}
                  label={name}
                  id={id}
                  material={rest}
                  onClose={() => {
                    setFilter((labelArr) => {
                      const clone = [...labelArr];
                      const removed = _.remove(clone, v => v === name);
                      if (removed.length) {
                        calculateRef.current.delete(name);
                        setRecalculate(!recalculate);
                      }
                      return clone;
                    })
                  }}
                  onQtyChange={(m, d) => {
                    calculateRef.current.set(name, m);
                    initDataRef.current.set(d.label, d);
                    setRecalculate(!recalculate);
                  }}
                />
              );
            })}
          </div>
          
        </div>
      </Container>
    </DataContext.Provider>
  )
}

export default App
