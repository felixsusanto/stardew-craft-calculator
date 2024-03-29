import React, { useState } from 'react';
import _ from 'lodash';
import CssBaseline from '@mui/material/CssBaseline';
import craftableCsv, { CraftableBase, CraftableMaterial } from './csv/craftables.csv';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CraftableComponent, { CraftableComponentHandler, zeroMask } from './components/CraftableComponent';
import TotalMaterial from './components/TotalMaterial';
import DataContext, { DataContextType, InitialData, InventoryData } from './context/InitialDataContext';
import CalculatorConfigContext, { CalculatorConfig, Season, Year } from './context/CalculatorConfigContext';
import { Box } from '@mui/material';
import Grid from '@mui/material/Grid';
import styled from 'styled-components';
import Footer from './components/Footer';
import Fab from '@mui/material/Fab';
import { ArrowUpward } from '@mui/icons-material';
import Header from './components/Header'; 
import mainLogo from './assets/main_logo.png';
import CraftableSprite from './components/CraftableSprite';
import CustomGoalForm, { CustomGoalFormPayload } from './components/CustomGoal';
import { ModeEditOutlined as ModeEditOutlinedIcon } from '@mui/icons-material';

export type Craftable = CraftableBase & CraftableMaterial;
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



function App() {
  const calculateRef = React.useRef(new Map<string, CraftableMaterial>());
  const initDataRef = React.useRef(new Map<string, InitialData>());
  const customGoalRef = React.useRef<Record<string, CraftableComponentHandler>>(null);
  const [craftable, setCraftable] = useState<Craftable[]>();
  const [filter, setFilter] = useState<string[]>([]);
  const [recalculate, setRecalculate] = useState<boolean>();
  const [total, setTotal] = useState<CraftableMaterial>();
  const [ctx, setCtx] = useState<Omit<DataContextType, 'setInventory'>>({});
  const [inventory, setInventory] = useState<InventoryData[]>([]);
  const [config, setConfig] = useState<CalculatorConfig>();
  const [customGoal, setCustomGoal] = useState<CustomGoalFormPayload[]>([]);
  

  React.useEffect(() => {
    const craftable: Craftable[] = craftableCsv;
    setCraftable(craftable);
    const existingInitData  = window.localStorage.getItem('initData');
    const existingInventoryData  = window.localStorage.getItem('inventory');
    const existingConfigData  = window.localStorage.getItem('configData');
    const initDataContext = (existingInitData ? JSON.parse(existingInitData) : []) as InitialData[];
    const inventoryDataContext = (existingInventoryData ? JSON.parse(existingInventoryData) : []) as InventoryData[];
    const initConfigDataContext = (
      existingConfigData ? 
      JSON.parse(existingConfigData) : defaultConfigValue
      ) as CalculatorConfig
    ;
    setCtx({ initData: initDataContext, inventory: inventoryDataContext });
    setConfig(initConfigDataContext);
  }, []);

  React.useEffect(() => {
    if (typeof ctx.initData !== 'undefined' && ctx.initData.length) {
      const craftables = ctx.initData
        .filter(item => item.type === undefined)
        .map((item) => item.label)
      ;
      const customGoals = ctx.initData
        .filter(item => item.type === 'goal')
        .map(item => {
          if (item.type === 'goal') {
            const divide = item.goal - item.possession;
            const meta = item.meta as CustomGoalFormPayload;
            const dividedMats = _.mapValues(meta.materials, (val) =>  val / divide);
            meta.materials = dividedMats;
            return item.meta;
          }
          throw new Error('wont be here');
        }) as CustomGoalFormPayload[]
      ;
      console.log('customGoal', customGoals);
      setCustomGoal(customGoals);
      setFilter(craftables);
    }
  }, [ctx]);
  React.useEffect(() => {
    if (inventory.length) {
      setCtx(existing => ({...existing, inventory}));
      window.localStorage.setItem('inventory', JSON.stringify(inventory));
    }
  }, [inventory]);

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
    setCtx(existing => ({...existing, initData: t}));
    console.log('t', t, initDataRef.current);
    window.localStorage.setItem('initData', JSON.stringify(t));
  }, [recalculate]);
  
  return (
    <DataContext.Provider value={{
      ...ctx,
      setInventory
    }} >
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
          <Header>
            <Autocomplete<Craftable>
              options={_.sortBy(craftableCsv, ['group', 'priority', 'label'])}
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
                  <CraftableSprite id={zeroMask(option.id)} style={{ marginRight: 10}}/>
                  {option.label}
                </Box>
              )}
            />
          </Header>
          <div className="mid">
            <Container>
              <Grid container justifyContent="flex-end">
                <CustomGoalForm 
                  onAddGoal={(goal) => {
                    setCustomGoal(curr => [...curr, goal]);
                  }}
                />
              </Grid>
              { (filter.length + customGoal.length) > 1 && (
                <TotalMaterial total={_.omitBy(total, (v) => v === 0)} />
              )}
              { (filter.length + customGoal.length) <= 0 && (
                <Splash>
                  <div className="title">
                    Craftables&nbsp;Calculator
                  </div>
                  <img 
                    src={mainLogo} 
                    alt="Stardew Valley" 
                  />
                </Splash>
              )}
              <div className="card">
                {customGoal.map((goal) => {
                  const myRef = { current: null };
                  return (
                    <CraftableComponent
                      ref={myRef} 
                      key={goal.id}
                      single={!goal.repeatable}
                      label={`Goal: ${goal.name}`}
                      id={goal.id}
                      purchasable={''}
                      material={goal.materials}
                      materialFilter={Object.keys(goal.materials)}
                      onClose={() => {
                        const newArr =_.filter(customGoal, (o) => o.id !== goal.id);
                        calculateRef.current.delete(`goal_${goal.id}`);
                        initDataRef.current.delete(`goal_${goal.id}`);
                        setCustomGoal(newArr);
                        setRecalculate(!recalculate);
                      }}
                      onQtyChange={(m, d) => {
                        calculateRef.current.set(`goal_${goal.id}`, m);
                        initDataRef.current.set(`goal_${goal.id}`, {...d, type: 'goal', meta: {
                          materials: m,
                          repeatable: goal.repeatable,
                          id: goal.id,
                          name: goal.name
                        }});
                        
                        setRecalculate(!recalculate);
                      }}
                      iconSection={
                        <CustomGoalForm 
                          className="icon"
                          ctaComponent={<ModeEditOutlinedIcon />}
                          initPayload={_.find(customGoal, o => o.id === goal.id)}
                          onAddGoal={(v) => {
                            let payload: any;
                            setCustomGoal((curr) => {
                              const clone = _.cloneDeep(curr);
                              const index = _.findIndex(clone, o => o.id === goal.id);
                              // clone[index] = {...v, id: goal.id };
                              payload = {...v, id: goal.id };
                              clone[index] = payload;
                              console.log('clone', clone, goal.id);
                              return clone;
                            });
                            const id = `goal_${goal.id}`;
                            const existing = initDataRef.current.get(id)!;
                            initDataRef.current.set(`goal_${goal.id}`, { ...existing, type: 'goal', meta: payload });
                            setRecalculate(!recalculate);
                            myRef.current && (myRef.current as any).updateMaterial(payload.materials);
                          }}
                        />
                      }
                    />
                  );
                })}
                { filter.map((label) => {
                  if (!craftable) return null;
                  const craft = _.find(craftable, { label }) as Craftable;
                  if (!craft) return null;
                  const {
                    id, 
                    label: name, 
                    group,
                    purchasable,
                    priority,
                    ...rest
                  } = craft;
                  return (
                    <CraftableComponent 
                      key={id}
                      label={name}
                      id={id}
                      purchasable={purchasable}
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
                        const {group, season, purchasable, priority, ...rest} = m;
                        calculateRef.current.set(name, rest);
                        initDataRef.current.set(d.label, {...d, type: undefined});
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
      </CalculatorConfigContext.Provider>
      
      <div style={{ position: 'fixed', right: 20, bottom: 20}}>
        <Fab color="primary" aria-label="add">
          <ArrowUpward />
        </Fab>
      </div>
    </DataContext.Provider>
  )
}

export default App
