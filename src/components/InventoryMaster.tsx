import TextField from '@mui/material/TextField';
import React from 'react';
import Materials from '../csv/material.csv';
import Craftables from '../csv/craftables.csv';
import { zeroMask } from './CraftableComponent';
import { MaterialSprite } from './CraftableSprite';
import { Close as CloseIcon} from '@mui/icons-material';
import styled from 'styled-components';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import _ from 'lodash';

const MAX_VALUE = 99999;

const ListParent = styled.ul`
  list-style: none;
  padding: 0;
  columns: 2;
  gap: 0 10px;
  > li {
    margin-bottom: 10px; 
    display: flex;
    align-items: center;
  }
`;

type InventoryState = Record<string, number>; 
type InventoryAction = {
  type: 'change';
  key: string;
  value: number;
};

const reducer: React.Reducer<InventoryState, InventoryAction> = (state, action) => {
  const newState = {...state, [action.key]: action.value};
  return newState;
};

const initState = () => {
  const state: InventoryState = {};
  Materials.forEach((m) => {
    state[m.material] = 0;
  });
  return state;
};

interface InventoryProps {
  craftableFilter?: string;
}

const checkMaterial = (craftableName: string) => {
  const craftable = _.find( Craftables, { label: craftableName });
  if (craftable) {
    const omitKey = [ "id", "label", "priority", "purchasable", "group"];
    const a = _.omitBy(craftable as Record<string, any>, (v) => v === 0);
    const b = _.omit(a, omitKey)
    return Object.keys(b);
  }
  return [];
};

const InventoryMaster: React.FC<InventoryProps> = (p) => {
  const [state, dispatch] = React.useReducer(reducer, initState());
  const [filter, setFilter] = React.useState<string>();

  React.useEffect(() => {
    p.craftableFilter && 
    checkMaterial(p.craftableFilter);
  }, []);
  return (
    <Paper elevation={4}
      sx={{
        p: 2,
        mb: 2,
      }}
    >
      <Typography variant="h6">Item Inventory {p.craftableFilter ? `: ${p.craftableFilter}` : ''}</Typography>
      {!p.craftableFilter && (
        <TextField 
          label="Filter" 
          variant="outlined" 
          size="small"
          sx={{ 
            width: '100%',
            margin: '10px 0'
          }}
          value={filter}
          onChange={(e) => {
            const val = e.currentTarget.value;
            setFilter(val);
          }}
        />
      )}
      <ListParent>
        {Materials
          .filter((m) => {
            if (!p.craftableFilter) return true;
            const whitelisted = checkMaterial(p.craftableFilter);
            return whitelisted.some(item => item === m.material);
          })
          .filter((m) => {
            if (!filter) return true;
            const regex = new RegExp(filter, 'gi');
            return regex.test(m.material);
          })
          .map((m) => {
            return (
              <li key={m.id}>
                <div className="form">
                  {<TextField 
                    variant="filled" 
                    label="Quantity" 
                    size="small"
                    inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                    value={state[m.material]} 
                    onChange={e => {
                      const isNumber = !isNaN(+e.currentTarget.value);
                      const value = +e.currentTarget.value;
                      isNumber && value <= MAX_VALUE && dispatch({type: 'change', key: m.material, value});
                    }}
                    InputLabelProps={{ shrink: true }}
                    sx={{ width: 100}}
                  /> }
                </div>
                <div>
                  <CloseIcon />
                </div>
                <div className="text">
                  <MaterialSprite id={zeroMask(m.id)}/>{' '}
                  {m.material}
                </div>
              </li>
            );
          })
        }
      </ListParent>
    </Paper>
  );
};

export default InventoryMaster;
