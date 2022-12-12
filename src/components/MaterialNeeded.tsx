import React from 'react';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import materialCsv from '../csv/material.csv';
import Checkbox from '@mui/material/Checkbox';
import numeral from 'numeral';
import Tooltip from '@mui/material/Tooltip';
import styled from 'styled-components';
import { Material } from '../csv/craftables.csv';
import Typography from '@mui/material/Typography';
import { zeroMask } from './CraftableComponent';
import _ from 'lodash';

type MaterialNeededProps = {
  material?: Material;
};

const SimpleRow = styled.div`
  display: flex;
  align-items: center;
  flex-basis: 100%; 
  @media(min-width: 600px) {
    flex-basis: calc(33.33% - 20px); 
  }
  .img {
    padding-right: 4px;
    display: inline-block;
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

const MaterialNeeded: React.FC<MaterialNeededProps> = (p) => {
  const [buy, setBuy] = React.useState<boolean>();
  if (!p.material) return null;
  const keys = Object.keys(p.material);
  if (keys.length === 0) return null;

  const soldMaterial = _.filter(materialCsv, v => v.price !== '')
    .map(v => v.material)
  ;
  const intersection = _.intersection(soldMaterial, keys);
  const buyable = !!intersection.length;
  
  return (
    <React.Fragment>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '0 30px'}}>
        {keys.map((key) => {
          const material = _.find(materialCsv, {material: key});
          if (!material) return null;
          return (
            <SimpleRow key={key}>
              <div>
                <div className="img">
                  <img src={`/img/object/${zeroMask(material.id)}.png`} />
                </div>
                <div className="txt">
                  <Typography variant="body2">
                    {material.material}
                  </Typography>
                </div>
              </div>
              <div className="dots"></div>
              <div className="qty">
                <Typography variant="body2">
                  {p.material && p.material[key]}
                </Typography>
              </div>
            </SimpleRow>
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
                    const qty = (p.material!)[key];
                    return (
                      <SimpleRow key={key}>
                        <div>
                          <div className="img">
                            <img src={`/img/object/${zeroMask(material.id)}.png`} />
                          </div>
                          <div className="txt">
                            <Typography variant="body2">
                              {material.material} &times;{qty}
                            </Typography>
                          </div>
                        </div>
                        <div className="dots" />
                        <div className="qty">
                          <Typography variant="body2">
                            { qty && priceCat.type === 'fixed' && 
                              <span><b>{numeral(priceCat.price * qty).format('0,0')}</b> G</span>
                            }
                            { qty && priceCat.type === 'year' && 
                              priceCat.prices
                                .map((p, i) => {
                                  return (
                                    <React.Fragment key={i}>
                                      <Tooltip arrow placement="top" title={i ? 'Year 2+' : 'Year 1'}>
                                        <span><b>{numeral(qty * p).format('0,0')}</b> G</span>
                                      </Tooltip>
                                      {i === 0 ? ' / ' : ''}
                                    </React.Fragment>
                                  );
                                })
                            }
                            { qty && priceCat.type === 'season' && 
                              priceCat.prices
                                .map((p, i) => {
                                  return (
                                    <React.Fragment key={i}>
                                      <Tooltip arrow placement="top" title={i ? 'Off Season' : 'On Season'}>
                                        <span><b>{numeral(qty * p).format('0,0')}</b> G</span>
                                      </Tooltip>
                                      {i === 0 ? ' / ' : ''}
                                    </React.Fragment>
                                  );
                                })
                            }
                          </Typography>
                        </div>
                      </SimpleRow>
                    );
                  })
                }
              </div>
              {intersection.length > 1 && (
                <div style={{marginTop: 8}}>
                  <SimpleRow>
                    <div>
                      <b>Total Costs</b>
                    </div>
                    <div className="dots" />
                    <div className="qty">
                      {intersection
                        .map((key) => {
                          const material = _.find(materialCsv, {material: key})!;
                          const priceCat = priceCategory(material.price);
                          const qty = (p.material!)[key];
                          if (priceCat.type === 'fixed') {
                            const total = priceCat.price * qty;
                            return [total, total];
                          } else {
                            return priceCat.prices.map(v => v * qty);
                          }
                        })
                        .reduce((acc, curr) => {
                          acc[0] = acc[0] + curr[0];
                          acc[1] = acc[1] + curr[1];
                          return acc;
                        })
                        .map((v, i) => {
                          return (
                            <React.Fragment key={i}>
                              <Tooltip arrow placement="top" title={i ? 'Maximum Cost' : 'Minimum Cost'}>
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
