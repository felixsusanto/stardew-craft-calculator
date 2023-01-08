import React, { useState } from 'react';
import _ from 'lodash';
import { recipes, Recipe } from "../assets/data/cookingRecipes";
import craftableCsv, { Material } from '../csv/craftables.csv';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import CraftableComponent, { zeroMask } from '../components/CraftableComponent';
import TotalMaterial from '../components/TotalMaterial';
import { DataContextType, InitialData } from '../context/InitialDataContext';
import { CalculatorConfig, Season, Year } from '../context/CalculatorConfigContext';
import { Box } from '@mui/material';
import styled from 'styled-components';
import { Craftable, Container } from './root';
import Header from '../components/Header'; 
import mainLogo from '../assets/main_logo.png';
import { MaterialSprite } from '../components/CraftableSprite';

export const CssTextField = styled(TextField)({
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


function CalculatorLayout() {
  const calculateRef = React.useRef(new Map<string, Material>());
  const initDataRef = React.useRef(new Map<string, InitialData>());
  const [recipe, setRecipe] = useState<Recipe[]>();
  const [filter, setFilter] = useState<string[]>([]);
  const [recalculate, setRecalculate] = useState<boolean>();
  const [total, setTotal] = useState<Material>();
  const [ctx, setCtx] = useState<DataContextType>({});
  const [config, setConfig] = useState<CalculatorConfig>();

  React.useEffect(() => {
    // const recipes: Craftable[] = craftableCsv;
    setRecipe(recipes);
    /*
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
    */
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
    <>
      <Header>
        <Autocomplete<Recipe>
          options={_.sortBy(recipes, ['name'])}
          onChange={(e, v) => {
            v && setFilter((filterArr) => {
              if (!filterArr.some(val => v.name === val)) {
                return [...filterArr, v.name];
              }
              return filterArr;
            });
          }}
          getOptionLabel={(recipe) => recipe.name }
          renderInput={(params) => <CssTextField {...params} size="small" label="Add Recipes"/>}
          renderOption={(props, option) => (
            <Box component="li" sx={{ '& > img': { mr: 2, flexShrink: 0 }, height: 48 }} {...props}>
              <MaterialSprite id={zeroMask(option.id)} style={{ marginRight: 10}}/>
              {option.name}
            </Box>
          )}
        />
      </Header>
      <Container>
        { filter.length > 1 && (
          <TotalMaterial total={_.omitBy(total, (v) => v === 0)} csvType="INGREDIENTS" />
        )}
        { !filter.length && (
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
          { filter.map((name) => {
            if (!recipe) return null;
            const craft = _.find(recipe, { name }) as Recipe;
            if (!craft) return null;
            const { id, ingredients } = craft;
            return (
              <CraftableComponent 
                csvType='INGREDIENTS'
                spriteType='MATERIAL'
                key={id}
                label={name}
                id={id}
                purchasable={''}
                material={ingredients}
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
                  initDataRef.current.set(d.label, d);
                  setRecalculate(!recalculate);
                }}
              />
            );
          })}
        </div>
      </Container>
    </>
  )
}

export default CalculatorLayout
