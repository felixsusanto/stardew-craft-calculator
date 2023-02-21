import React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import materialCsv, { Material } from '../csv/material.csv';
import Checkbox from '@mui/material/Checkbox';
import numeral from 'numeral';
import Tooltip from '@mui/material/Tooltip';
import styled from 'styled-components';
import { CraftableMaterial } from '../csv/craftables.csv';
import Typography from '@mui/material/Typography';
import { zeroMask } from './CraftableComponent';
import _ from 'lodash';
import CalculatorConfigContext, { Year, Season } from '../context/CalculatorConfigContext';
import { CheckCircle } from '@mui/icons-material';
import { MaterialSprite, SellerSprite } from './CraftableSprite';
import LinearProgress from '@mui/material/LinearProgress';
import DataContext from '../context/InitialDataContext';
import { inventoryInitState } from './InventoryMaster';

type MaterialNeededProps = {
  material?: CraftableMaterial;
}; 

const SimpleRow = styled.div`
  display: flex;
  align-items: center;
  flex: 1;
  .img {
    padding-right: 4px;
    display: inline-block;
    line-height: 0;
  }
  .txt {
    display: inline-block;
  }
  .dots {
    flex: 1;
    margin-left: 8px;
    align-self: flex-end;
    &:before {
      content: '';
      display: block;
      border-top: 1px dashed grey;
      margin-bottom: 8px;
    }
  }
  .qty {
    padding-left: 4px;
  }
`;

type PriceCatReturn = 
  | {
    type: 'fixed';
    price: number;
  }
  | {
    type: 'season' | 'year';
    prices: number[];
  }
;

const priceCategory = (p: string): PriceCatReturn => {
  const fixed = /\d+!/g;
  const season = /\d+\|\d+/;
  const year = /\d+\/\d+/;
  if (fixed.test(p)) {
    const price =  +p.replace('!', '');
    return {
      type: 'fixed',
      price
    }
  } else if(season.test(p)) {
    return {
      type: 'season',
      prices: p.split('|').map(v => +v)
    };
  } else if (year.test(p)) {
    return {
      type: 'year',
      prices: p.split('/').map(v => +v)
    };
  }
  throw new Error('not matching with anything');
};

const BuySection = styled.div`
  margin-top: 10px;
  border-top: 1px solid #ddd;
`;

type SimpleChecklistProps = {
  material: string;
  value?: number;
  children?: React.ReactNode;
  tooltipTitle?: string;
};
const SimpleChecklist: React.FC<SimpleChecklistProps> = (props) => {
  const [check, setCheck] = React.useState(false);
  return (
    <SimpleRow>
      <div>
        {props.children}
        <div className="txt" onClick={() => setCheck(!check)} style={{ cursor: 'pointer' }}>
          <Tooltip title={props.tooltipTitle} arrow>
            <Typography variant="body2">
              {props.material}
            </Typography>
          </Tooltip>
        </div>
      </div>
      <div className="dots"></div>
      <div className="qty">
        <Typography variant="body2">
          {props.value}
          <CheckCircle sx={{
            width: 16,
            float: 'right',
            position: 'relative',
            bottom: 2,
            marginLeft: '3px',
            fill: '#067ff0',
            visibility: check ? 'visible' : 'hidden'
          }}/>
        </Typography>
      </div>
    </SimpleRow>
  );
};

const ChecklistContainer = styled.div`
  display: flex;
  flex-basis: 100%; 
  flex-wrap: wrap;
  margin-bottom: 6px;
  @media(min-width: 500px) {
    flex-basis: calc(50% - 30px); 
  }
  @media(min-width: 700px) {
    flex-basis: calc(33.33% - 20px); 
  }
  .progress {
    width: 100%;
  }
`;

interface Bars {
  id: number;
  name: string;
  ingredients: {
    id: number;
    name: string;
    qty: number;
  }[];
}

const buyableBarsData: Bars[] = [
  {
    id: 334,
    name: 'Copper Bar',
    ingredients: [
      {
        id: 382,
        name: 'Coal',
        qty: 1,
      },
      {
        id: 378,
        name: 'Copper Ore',
        qty: 5,
      },
    ],
  },
  {
    id: 335,
    name: 'Iron Bar',
    ingredients: [
      {
        id: 382,
        name: 'Coal',
        qty: 1,
      },
      {
        id: 380,
        name: 'Iron Ore',
        qty: 5,
      },
    ],
  },
  {
    id: 336,
    name: 'Gold Bar',
    ingredients: [
      {
        id: 382,
        name: 'Coal',
        qty: 1,
      },
      {
        id: 384,
        name: 'Gold Ore',
        qty: 5,
      },
    ],
  },
];

interface onCalculationPayload {
  id: string; 
  payload: [number, number];
};

interface BuyListItemProps {
  id: string;
  material: Material;
  priceCat: PriceCatReturn;
  qty: number;
  season: Season;
  year: Year;
  onCalculation?: (v: onCalculationPayload) => void;
}

const BuyListItem: React.FC<BuyListItemProps> = (p) => {
  const { material, priceCat, qty, year, season } = p;
  React.useEffect(() => {
    if (p.onCalculation) {
      let payload: onCalculationPayload;
      if (priceCat.type === 'fixed') {
        const total = priceCat.price * qty;
        payload = {id: p.id, payload: [total, total]};
      } else {
        payload = {id: p.id, payload: priceCat.prices.map(p => p * qty) as [number, number]};
      }
      p.onCalculation(payload);
    }
  }, [material, priceCat, qty, year, season])
  
  return (
    <SimpleRow>
      <div style={{display: 'flex', alignItems: 'center'}}>
        <div className="img">
          <MaterialSprite id={zeroMask(material.id)}/>
        </div>
        <div className="txt">
          <Typography variant="body2">
            {material.material} &times;{qty}
          </Typography>
        </div>
      </div>
      <div className="dots" />
      <div className="qty">
        <Typography variant="body2" sx={{display: 'inline-block'}}>
          { priceCat.type === 'fixed' && 
            <span><b>{numeral(priceCat.price * qty).format('0,0')}</b> G</span>
          }
          { priceCat.type === 'year' && 
            priceCat.prices
              .map((p, i) => {
                if (year === Year.ONE && i === 1) return null;
                if (year === Year.TWO_PLUS && i === 0) return null;
                return (
                  <React.Fragment key={i}>
                    <Tooltip arrow placement="top" title={i ? 'Year 2+' : 'Year 1'}>
                      <span><b>{numeral(qty * p).format('0,0')}</b> G</span>
                    </Tooltip>
                    {year === Year.EMPTY && i === 0 ? ' / ' : ''}
                  </React.Fragment>
                );
              })
          }
          { priceCat.type === 'season' &&
            priceCat.prices
              .map((p, i) => {
                if (season !== Season.EMPTY) {
                  if (material.season === season && i === 1) return null;
                  if (material.season !== season && i === 0) return null;
                }
                return (
                  <React.Fragment key={i}>
                    <Tooltip arrow placement="top" title={i ? `Off Season(${material.season})` : 'On Season'}>
                      <span><b>{numeral(qty * p).format('0,0')}</b> G</span>
                    </Tooltip>
                    {season === Season.EMPTY && i === 0 ? ' / ' : ''}
                  </React.Fragment>
                );
              })
          }
        </Typography>
        <SellerSprite id={material.seller} scale={1}
          style={{display: 'inline-block'}}
        />
      </div>
    </SimpleRow>
  );
}

const reducer: React.Reducer<Record<string, [number, number]>, onCalculationPayload> = (state, action) => {
  const cloned = _.cloneDeep(state);
  cloned[action.id] = action.payload;
  return cloned;
};

const MaterialNeeded: React.FC<MaterialNeededProps> = (p) => {
  const { inventory } = React.useContext(DataContext);
  const [buy, setBuy] = React.useState<boolean>();
  const { config } = React.useContext(CalculatorConfigContext);
  const [state, dispatch] = React.useReducer(reducer, {});
  if (!config || !p.material) return null;
  const { year, season } = config;
  const keys = Object.keys(p.material);
  if (keys.length === 0) return null;

  const soldMaterial = _.filter(materialCsv, v => v.price !== '')
    .map(v => v.material)
  ;
  const buyableBars = buyableBarsData.map(v => v.name);
  const intersection = _.intersection(soldMaterial, keys);
  const barsSection = _.intersection(buyableBars, keys);
  const buyable = !!intersection.length;
  const inventoryState = inventoryInitState(inventory);
  
  return (
    <React.Fragment>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '0 30px'}}>
        {keys.map((key) => {
          const material = _.find(materialCsv, {material: key});
          if (!material || !p.material) return null;
          const progressValue = Math.min(inventoryState[material.material] / p.material[key] * 100, 100);
          const shortSurplus = p.material[key] - inventoryState[material.material];
          const tooltipMsg = shortSurplus > 0 ? `Short of ${shortSurplus} units` : `Surplus of ${Math.abs(shortSurplus)} units from inventory`;
          return (
            <ChecklistContainer key={key}>
              <SimpleChecklist 
                material={material.material}
                value={p.material[key]}
                tooltipTitle={tooltipMsg}
              >
                <div className="img">
                  <a href={material.link} target="_blank">
                    <MaterialSprite id={zeroMask(material.id)} />
                  </a>
                </div>
              </SimpleChecklist>
              <div className="progress">
                <LinearProgress variant="determinate" 
                  value={progressValue}
                  sx={{height: 2}}
                /> 
              </div>
            </ChecklistContainer>
          );
        })}
      </div>
      { buyable && (
        <BuySection>
          <FormGroup>
            <FormControlLabel 
              control={<Checkbox size="small" />}
              label="Buy Resources"
              componentsProps={{typography: { variant: 'body2' }}}
              onChange={(e, v) => {
                setBuy(v);
              }}
              value={buy}
            />
          </FormGroup>
          { buy && (
            <React.Fragment>
              <div>
                {intersection
                  .map((key) => {
                    const material = _.find(materialCsv, {material: key})!;
                    const priceCat = priceCategory(material.price);
                    const qty = Math.max((p.material!)[key] - inventoryState[material.material], 0);
                    const props = { material, priceCat, qty, season, year, onCalculation:console.log };
                    return <BuyListItem {...props} key={key} id={key}/>;
                  })
                }
              </div>
              {barsSection.length > 0 && (
                <div style={{marginTop: 8}}>
                  {barsSection.map((key) => {
                    const bar = _.find(buyableBarsData, {name: key})!;
                    const qty = Math.max((p.material!)[key] - inventoryState[key], 0);
                    if (!qty) return null;
                    return (
                      <div key={key}>
                        <Typography variant="body2">
                          <MaterialSprite id={zeroMask(bar.id)}/> {' '}
                          <b>{key} &times; {qty}</b>
                        </Typography>
                        <div style={{marginLeft: 16}}>
                          {bar.ingredients.map((ing) => {
                            const material = _.find(materialCsv, {material: ing.name})!;
                            const props: BuyListItemProps = {
                              id: `${key}_${ing.name}`,
                              qty: ing.qty * qty,
                              material,
                              priceCat: priceCategory(material.price),
                              season,
                              year,
                              onCalculation:console.log
                            };
                            return <BuyListItem key={ing.name} {...props} />
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
              {(intersection.length + barsSection.length) > 1 && (
                <div style={{marginTop: 8}}>
                  <SimpleRow>
                    <div>
                      <b>Total Costs</b>
                    </div>
                    <div className="dots" />
                    <div className="qty">
                      {[...intersection
                        .map((key) => {
                          const material = _.find(materialCsv, {material: key})!;
                          const priceCat = priceCategory(material.price);
                          const qty = Math.max((p.material!)[key] - inventoryState[material.material], 0);
                          
                          return {
                            material, priceCat, qty
                          }
                        }),
                        ...barsSection
                        .map((barName) => {
                          const bar = _.find(buyableBarsData, {name: barName})!;
                          const qty = Math.max((p.material!)[barName] - inventoryState[barName], 0);
                          const keys = bar.ingredients.map(ing => {
                            const material = _.find(materialCsv, {material: ing.name})!;
                            const priceCat = priceCategory(material.price);
                            return { material, priceCat, qty: ing.qty * qty};
                          });
                          return keys;
                        })
                        .reduce((acc, curr) => [...acc, ...curr], [])
                        ]
                        .map((p) => {
                          const {priceCat, material, qty} = p;
                          if (priceCat.type === 'fixed') {
                            const total = priceCat.price * qty;
                            return [total, total];
                          }
                          if (priceCat.type === 'season' && season !== Season.EMPTY) {
                            const index = material.season === season ? 0 : 1;
                            const total = qty * priceCat.prices[index];
                            const res = [total, total];
                            return res;
                          } else if (priceCat.type === 'year' && year !== Year.EMPTY) {
                            const index = year === Year.ONE ? 0 : 1;
                            const total = qty * priceCat.prices[index];
                            const res = [total, total];
                            return res;
                          } else {
                            return priceCat.prices.map(v => v * qty);
                          }
                        })
                        .reduce((acc, curr) => {
                          acc[0] = acc[0] + curr[0];
                          acc[1] = acc[1] + curr[1];
                          return acc;
                        })
                        .map((v, i, arr) => {
                          const sameValueArray = arr[0] === arr[1];
                          if (sameValueArray && i === 0) return null;
                          const title = sameValueArray ? 
                            'Total Costs' : (i ? 'Maximum Cost' : 'Minimum Cost')
                          ;
                          return (
                            <React.Fragment key={i}>
                              <Tooltip
                                arrow
                                placement="top"
                                title={title}>
                                <span><b>{numeral(v).format('0,0')}</b> G</span>
                              </Tooltip>
                              {i === 0 ? ' / ' : ''}
                            </React.Fragment>
                          );
                        })
                      }
                    </div>
                  </SimpleRow>
                </div>
              )}
            </React.Fragment>
          )}
          
        </BuySection>
      )}
    </React.Fragment>
  );
};

export default MaterialNeeded;
