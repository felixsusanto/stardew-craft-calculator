import React, { useState } from 'react';
import _ from 'lodash';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import { Delete } from '@mui/icons-material';  
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import styled from 'styled-components';

import { CraftableBase, Material } from '../csv/craftables.csv';
import DataContext, { InitialData } from '../context/InitialDataContext';
import MaterialNeeded from './MaterialNeeded';
import { generateNewItems, newData } from '../csv/utilities';
import CraftableSprite, { SellerSprite } from './CraftableSprite';
import InventoryMaster from './InventoryMaster';
import Modal from '@mui/material/Modal';
import { Inventory as InventoryIcon } from '@mui/icons-material';

const MAX_VALUE = 9999;

export const zeroMask = (x: number) => {
  if (x < 10) {
    return `00${x}`;
  } else if (x < 100) {
    return `0${x}`;
  }
  return x + '';
}

type CraftableProps = Omit<CraftableBase, 'group'|'priority'> & {
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
  const [goal, setGoal] = useState(1);
  const [possession, setPossession] = useState(0);
  const [needed, setNeeded] = useState(0);
  const [materialNeeded, setMaterialNeeded] = useState<Material>();
  const [openModal, setOpenModal] = React.useState<boolean>(false);

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
      goal, 
      possession
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
    <>
      <Paper
        elevation={4}
        sx={{
          p: 2,
          mb: 2,
        }}
      >
        <TitleCard>
          <div className="img">
            <CraftableSprite 
              id={zeroMask(props.id)}
              scale={2}
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
            <Delete />
          </div>
          <div className="trash"
            onClick={() => setOpenModal(true)}
          >
            <InventoryIcon />
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
                const value = +e.currentTarget.value;
                isNumber && value <= MAX_VALUE && setGoal(value);
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
                const value = +e.currentTarget.value;
                isNumber && value <= MAX_VALUE && setPossession(value);
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
        <Purchasable data={props.purchasable} />
        
        <div style={{marginTop: 10}}>
          <MaterialNeeded material={materialNeeded} />
        </div>
      </Paper>
      <Modal
        open={openModal}
        onClose={() => setOpenModal(false)}
      >
        <Paper sx={{p: 3, maxWidth: 800, margin: '0 auto', mt: 2, bgColor: '#fff'}}>
          <InventoryMaster craftableFilter={props.label} />
        </Paper>
      </Modal>
    </>
  );
};


const Purchasable: React.FC<{data: string}> = (props) => {
  if (props.data === '') return null;
  const [seller, value, currency, qty] = props.data.split('/');
  return (
    <Typography variant="body2" sx={{mt:1}}>
      <SellerSprite id={ seller }/> selling for {value} {currency} / {qty ? `${qty} pcs` : 'pc'}
    </Typography>
  );
};

export default CraftableComponent;
