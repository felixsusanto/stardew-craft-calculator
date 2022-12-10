import React, { useState } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import CssBaseline from '@mui/material/CssBaseline';
import craftableCsv from './csv/craftables.csv';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
// import * as Papa from 'papaparse';
import CraftableComponent, { MaterialNeeded } from './components/CraftableComponent';
import Container from '@mui/material/Container';


// const Container = styled.div`
//   max-width: 800px;
//   margin: 0 auto;
//   padding: 0 20px;
// `;

export interface CraftableBase {
  id: number;
  label: string;
}

export type Material = Record<string, number>;
export type Craftable = CraftableBase & Material;

function App() {
  const ref = React.useRef(new Map<string, Material>());
  const [craftable, setCraftable] = useState<Craftable[]>();
  const [filter, setFilter] = useState<string[]>([]);
  const [recalculate, setRecalculate] = useState<boolean>();
  const [total, setTotal] = useState<Material>();
  React.useEffect(() => {
    const craftable: Craftable[] = craftableCsv;
    setCraftable(craftable);
  }, []);
  React.useEffect(() => {
    const total = [...ref.current.values()]
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
  }, [recalculate]);

  return (
    <React.Fragment>
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
            renderInput={(params) => <TextField {...params} label="Add Craftables" />}
          />
          <div>
            <MaterialNeeded material={_.omitBy(total, (v) => v === 0)} />  
          </div>
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
                        ref.current.delete(name);
                        setRecalculate(!recalculate);
                      }
                      return clone;
                    })
                  }}
                  onQtyChange={(m) => {
                    ref.current.set(name, m);
                    setRecalculate(!recalculate);
                  }}
                />
              );
            })}
          </div>
          
        </div>
      </Container>
    </React.Fragment>
  )
}

export default App
