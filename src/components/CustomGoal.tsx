import Paper from '@mui/material/Paper';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox'
import React from 'react';
import { CraftableProps, zeroMask } from './CraftableComponent';
import Autocomplete from '@mui/material/Autocomplete';
import materialCsv from '../csv/material.csv';
import {CheckBoxOutlineBlank as CheckBoxOutlineBlankIcon} from '@mui/icons-material';
import {CheckBox as CheckBoxIcon} from '@mui/icons-material';
import { MaterialSprite } from './CraftableSprite';
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type CustomGoalData = {
  goalName: string;
  repeatable?: boolean;
} & Pick<CraftableProps, 'onQtyChange' | 'onClose' | 'material'>

type Option = { label: string; id: number; };

const options: Option[] = [
  ...materialCsv.map((m) => ({ label: m.material, id: m.id })),
  { label: 'Money', id: 384 }
];

const validate = (arrStr: string[], obj: Record<string, number>, name: string) => {
  if (!arrStr.length || !name.trim().length) return false;
  const keys = Object.keys(obj);
  const everyKeysCompleted = arrStr.every(k => keys.some(v => v === k));
  if (everyKeysCompleted) {
    return keys.every(k => obj[k] > 0);
  } else {
    return false;
  }
};

const CustomGoalForm: React.FC<{}> = () => {
  const [name, setName] = React.useState<string>('Deluxe Barn');
  const [repeatable, setRepeatable] = React.useState<boolean>(true);
  const [materials, setMaterials] = React.useState<Option[]>([]);
  const [goals, setGoals] = React.useState<Record<string, number>>({});
  return (
    <Paper elevation={4}
      sx={{
        p: 2,
        mb: 2,
      }}
    >
      <Typography variant="h6" mb={2}>
        Set a Goal
      </Typography>
      <TextField
        required
        id="standard-required"
        label="Goal Name"
        value={name}
        onChange={(e) => setName(e.currentTarget.value)}
        variant="standard"
        sx={{ width: '100%'}}
      />
      <FormGroup>
        <FormControlLabel 
          control={<Checkbox defaultChecked/>} 
          label="Is Repeatable" 
          value={repeatable}
          onChange={e => {
            const val = (e.currentTarget as HTMLInputElement).checked;
            setRepeatable(val);
          }}
        />
      </FormGroup>
      <Typography variant="body2" mb={2}>
        <b>
          Materials / Ingredients
        </b>
      </Typography>
      <Autocomplete<Option, true>
        size="small"
        multiple
        disableCloseOnSelect
        options={options}
        onChange={(e, v) => {
          setMaterials(v);
        }}
        renderInput={(params) => <TextField {...params} label="Material" />}
        renderOption={(props, option, { selected }) => (
          <li {...props}>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option.label}
          </li>
        )}
      />
      <div style={{ columns: 2, gap: '0 10px', paddingBottom: 20}}>
        {materials.map((mat, index) => {
          return (
            <Grid container spacing={1} pt={2} alignItems="center" key={index}>
              <Grid item pt={1} flexBasis={98}>
                <TextField
                  required
                  label="Goal Qty"
                  variant="filled"
                  size='small'
                  sx={{ width: '100%'}}
                  value={goals[mat.label] || 0}
                  onChange={(e) => {
                    if (isNaN(+e.currentTarget.value)) return;
                    const value = +e.currentTarget.value;
                    setGoals((curr) => ({...curr, [mat.label]: value}));
                  }}
                  inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                />
              </Grid>
              <Grid item flex={1} pt={1}>
                <Typography variant="body2" key={mat.id} mt={1}>
                  <MaterialSprite id={zeroMask(mat.id)}/>{' '}
                  {mat.label}
                </Typography>
              </Grid>
            </Grid>
          );
        })}
      </div>
      
      {validate(materials.map(o => o.label), goals, name)
        && <Button variant="outlined">Submit</Button>
      }
      
    </Paper>
  );
};



export default CustomGoalForm;
