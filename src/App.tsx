import React, { useState } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import CssBaseline from '@mui/material/CssBaseline';
import craftableCsv from './csv/craftables.csv';
 
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
  name: string;
}

export type Material = Record<string, number>;
export type Craftable = CraftableBase & Material;

function App() {
  const ref = React.useRef(new Map<string, Material>());
  const [craftable, setCraftable] = useState<Craftable[]>();
  const [total, setTotal] = useState<Material>();
  React.useEffect(() => {
    const craftable: Craftable[] = craftableCsv;
    setCraftable(craftable);
  }, []);

  return (
    <React.Fragment>
      <CssBaseline />
      <Container maxWidth="sm">
        <div className="App">
          <div>
            <MaterialNeeded material={_.omitBy(total, (v) => v === 0)} />  
          </div>
          <div className="card">
            { craftable?.map((craft) => {
              const {id, name, ...rest} = craft;
              return (
                <CraftableComponent 
                  key={id}
                  name={name}
                  id={id}
                  material={rest}
                  onQtyChange={(m) => {
                    ref.current.set(name, m);
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
                  }}
                />
              );
            }) }
          </div>
        </div>
      </Container>
    </React.Fragment>
  )
}

export default App
