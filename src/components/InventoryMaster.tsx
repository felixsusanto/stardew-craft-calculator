import TextField from '@mui/material/TextField';
import React from 'react';
import Materials from '../csv/material.csv';
import Craftables from '../csv/craftables.csv';
import { zeroMask } from './CraftableComponent';
import { MaterialSprite } from './CraftableSprite';
import { Close as CloseIcon} from '@mui/icons-material';
import styled from 'styled-components';
import Typography from '@mui/material/Typography';
import _ from 'lodash';
import Button from '@mui/material/Button';
import DataContext, { InventoryData } from '../context/InitialDataContext';

const MAX_VALUE = 99999;

const ListParent = styled.ul`
  list-style: none;
  padding: 0;
  columns: 1;
  gap: 0 10px;
  @media(min-width: 600px) {
    columns: 2;
  }
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

export const inventoryInitState = (inventory?: InventoryData[]) => {
  const state: InventoryState = {};
  if (!inventory || (Array.isArray(inventory) && (inventory.length === 0))) {
    Materials.forEach((m) => {
      state[m.material] = 0;
    });
    return state;
  }
  inventory.map((inv) => {
    state[inv.name] = inv.qty;
  })
  return state;
};

interface InventoryProps {
  craftableFilter?: string | null;
  materialFilter?: string[];
  onClose?: () => void;
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
  const { inventory, setInventory } = React.useContext(DataContext);
  const [state, dispatch] = React.useReducer(reducer, inventory, inventoryInitState);
  const [filter, setFilter] = React.useState<string>();
 
  return (
    <React.Fragment>
      <Typography variant="h6">Item Inventory {p.craftableFilter ? `: ${p.craftableFilter}` : ''}</Typography>
      {p.craftableFilter === undefined && (
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
            if (p.craftableFilter) {
              const whitelisted = checkMaterial(p.craftableFilter);
              return whitelisted.some(item => item === m.material);
            } else if (Array.isArray(p.materialFilter) && p.materialFilter.length) {
              return p.materialFilter.some(item => item === m.material);
            } else {
              return true;
            }
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
      <Button variant="outlined"
        onClick={() => {
          const final = Object.keys(state).reduce((acc, currKey) => {
            acc.push({
              name: currKey,
              qty: state[currKey]
            });
            return acc;
          }, [] as InventoryData[]);
          setInventory(final);
          p.onClose && p.onClose();
        }}
      >Save</Button>
    </React.Fragment>
  );
};

export default InventoryMaster;
