import React, { useState } from 'react';
import _ from 'lodash';
import CssBaseline from '@mui/material/CssBaseline';
import craftableCsv, { CraftableBase, Material } from './csv/craftables.csv';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CraftableComponent, { zeroMask } from './components/CraftableComponent';
import TotalMaterial from './components/TotalMaterial';
import DataContext, { DataContextType, InitialData } from './context';
import { Box } from '@mui/material';
export type Craftable = CraftableBase & Material;
import styled from 'styled-components';
import Footer from './components/Footer';

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

const Container = styled.div`
  max-width: 620px;
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
      <ThreeRowFlex>
        <div style={{background: 'rgba(21, 71, 148, 0.8)', padding: '10px 0', marginBottom: '10px'}}>
          <Container>
            <Autocomplete<Craftable>
              options={_.sortBy(craftableCsv, ['group', 'label'])}
              groupBy={(option) => option.group}
              onChange={(e, v) => {
                v && setFilter((filterArr) => {
                  if (!filterArr.some(val => v.label === val)) {
                    return [...filterArr, v.label];
                  }
                  return filterArr;
                });
              }}
              renderInput={(params) => <CssTextField {...params} size="small" label="Add Craftables"/>}
              renderOption={(props, option) => (
                <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 }, height: 48 }} {...props}>
                  <img
                    loading="lazy"
                    width="16"
                    src={`/img/craftables/${zeroMask(option.id)}.png`}
                    alt=""
                  />
                  {option.label}
                </Box>
              )}
            />
          </Container>
        </div>
        <div className="mid">
          <Container>
            <TotalMaterial total={_.omitBy(total, (v) => v === 0)} />
            { !filter.length && (
              <Splash>
                <div className="title">
                  Craftables&nbsp;Calculator
                </div>
                <img 
                  src="https://stardewvalley.net/wp-content/uploads/2017/12/main_logo.png" 
                  alt="Stardew Valley" 
                />
              </Splash>
            )}
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
                          initDataRef.current.delete(name);
                          setRecalculate(!recalculate);
                        }
                        return clone;
                      })
                    }}
                    onQtyChange={(m, d) => {
                      const {group, ...rest} = m;
                      calculateRef.current.set(name, rest);
                      initDataRef.current.set(d.label, d);
                      setRecalculate(!recalculate);
                    }}
                  />
                );
              })}
            </div>
          </Container>
        </div>
        <Footer />
      </ThreeRowFlex>
    </DataContext.Provider>
  )
}

export default App
