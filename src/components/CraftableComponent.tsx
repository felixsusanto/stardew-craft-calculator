import React, { useState } from 'react';
import _ from 'lodash';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import styled from 'styled-components';
import materialCsv from '../csv/material.csv';
import { CraftableBase, Material } from '../csv/craftables.csv';
import DataContext, { InitialData } from '../context';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import numeral from 'numeral';
import Tooltip from '@mui/material/Tooltip';

console.log(materialCsv);

export const zeroMask = (x: number) => {
  if (x < 10) {
    return `00${x}`;
  } else if (x < 100) {
    return `0${x}`;
  }
  return x + '';
}

type CraftableProps = Omit<CraftableBase, 'group'> & {
  material: Material;
  onQtyChange: (v: Material, d: InitialData) => void;
  onClose: () => void;
};

const TitleCard = styled.div`
  display: flex;
  margin-bottom: 10px;;
  .img {
    flex: 0 0 32px;
  }
  .trash {
    align-self: flex-start;
    cursor: pointer;
  }
  .text {
    margin-left: 8px;
    flex: 1;
    align-self: flex-end;
  }
`;

const CraftableComponent: React.FC<CraftableProps> = (props) => {
  const { initData } = React.useContext(DataContext);
  const [goal, setGoal] = useState(0);
  const [possession, setPossession] = useState(0);
  const [needed, setNeeded] = useState(0);
  const [materialNeeded, setMaterialNeeded] = useState<Material>();

  React.useEffect(() => {
    const res = goal - possession;
    setNeeded(res >= 0 ? res : 0);
  }, [goal, possession]);
  
  React.useEffect(() => {
    const clone = {...props.material};
    Object.keys(clone)
      .forEach(key => {
        const num = clone[key] * needed;
        clone[key] = num;
      })
    ;
    const filtered = _.omitBy(clone, (v) => v === 0);
    props.onQtyChange(clone, {
      label: props.label,
      goal, possession
    });
    setMaterialNeeded(filtered);
  }, [needed]);

  React.useEffect(() => {
    if (initData) {
      const exist = _.find(initData, {label: props.label});
      if (exist) {
        const { possession, goal } = exist;
        setGoal(goal);
        setPossession(possession);
      }
    }
  }, [initData]);

  return (
    <Paper
      elevation={4}
      sx={{
        p: 2,
        mb: 2,
      }}
    >
      <TitleCard>
        <div className="img">
          <img src={`/img/craftables/${zeroMask(props.id)}.png`} 
            style={{ width: 32 }}
          />
        </div>
        <div className="text">
          <Typography variant="h6" gutterBottom>
            { props.label }
          </Typography>
        </div>
        <div className="trash"
          onClick={() => props.onClose()}
        >
          <DeleteIcon />
        </div>
      </TitleCard> {' '}
      <Grid container spacing={2}>
        <Grid item xs={4}>
          <TextField 
            variant="standard" 
            label="Goal" 
            size="small"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            value={goal} 
            onChange={e => {
              const isNumber = !isNaN(+e.currentTarget.value);
              isNumber && setGoal(+e.currentTarget.value);
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField 
            variant="standard" 
            label="Possession" 
            size="small"
            inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
            value={possession} 
            onChange={e => {
              const isNumber = !isNaN(+e.currentTarget.value);
              isNumber && setPossession(+e.currentTarget.value);
            }}
            InputLabelProps={{ shrink: true }}
          />
        </Grid>
        <Grid item xs={4}>
          <TextField
            variant="standard" 
            size="small"
            disabled
            label="Needed"
            value={needed}
          />
        </Grid>
      </Grid>
      <div style={{marginTop: 10}}>
        <MaterialNeeded material={materialNeeded} />
      </div>
    </Paper>
  );
};
type MaterialNeededProps = {
  material?: Material;
};

const SimpleRow = styled.div`
  display: flex;
  align-items: center;
  flex-basis: 100%; 
  @media(min-width: 460px) {
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

const BuySection = styled.div`
  margin-top: 10px;
  /* padding-top: 10px; */
  border-top: 1px solid #ddd;
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

export const MaterialNeeded: React.FC<MaterialNeededProps> = (p) => {
  const [buy, setBuy] = React.useState<boolean>();
  if (!p.material) return null;
  const keys = Object.keys(p.material);
  if (keys.length === 0) return null;

  const soldMaterial = _.filter(materialCsv, v => v.price !== '')
    .map(v => v.material)
  ;
  const buyable = !!_.intersection(soldMaterial, keys).length;
  
  return (
    <React.Fragment>
      <div style={{display: 'flex', flexWrap: 'wrap', gap: '0 20px'}}>
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
            <div>
              {keys.map((key) => {
                const material = _.find(materialCsv, (mat) => {
                  return mat.material === key && mat.price !== '';
                });
                if (!material) return null;
                const qty = p.material && p.material[key];
                const priceCat = priceCategory(material.price);
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
                    <div className="dots"></div>
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
              })}
            </div>
          )}
        </BuySection>
      )}
    </React.Fragment>
  );
};

export default CraftableComponent;
