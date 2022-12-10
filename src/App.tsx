import React, { useState } from 'react';
import _ from 'lodash';
import styled from 'styled-components';
import craftableCsv from './csv/craftables.csv';
import materialCsv from './csv/material.csv'; 
// import * as Papa from 'papaparse';

const zeroMask = (x: number) => {
  if (x < 10) {
    return `00${x}`;
  } else if (x < 100) {
    return `0${x}`;
  }
  return x + '';
}

const Container = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 0 20px;
`;

interface CraftableBase {
  id: number;
  name: string;
}

type Material = Record<string, number>;
type Craftable = CraftableBase & Material;
type CraftableProps = CraftableBase & {
  material: Material;
  onQtyChange: (v: Material) => void;
};

const CraftableComponent: React.FC<CraftableProps> = (props) => {
  
  const [qty, setQty] = useState(0);
  
  const [materialNeeded, setMaterialNeeded] = useState<Material>();
  React.useEffect(() => {
    const clone = {...props.material};
    Object.keys(clone)
      .forEach(key => {
        const num = clone[key] * qty;
        clone[key] = num;
      })
    ;
    const filtered = _.omitBy(clone, (v) => v === 0);
    props.onQtyChange(clone);
    setMaterialNeeded(filtered);
  }, [qty])
  return (
    <div>
      <img src={`/img/${zeroMask(props.id)}.png`} />
      { props.name }{' '}
      <input type="number" value={qty} onChange={e => setQty(+e.currentTarget.value)}/>
      <br />
      {JSON.stringify(materialNeeded)}
    </div>
  );
};


function App() {
  const ref = React.useRef(new Map<string, Material>());
  const [craftable, setCraftable] = useState<Craftable[]>();
  const [total, setTotal] = useState<Material>();
  React.useEffect(() => {
    const craftable: Craftable[] = craftableCsv;
    setCraftable(craftable);
  }, []);

  return (
    <Container>

      <div className="App">
        <div>{JSON.stringify(_.omitBy(total, (v) => v === 0))}</div>
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
  )
}

export default App
