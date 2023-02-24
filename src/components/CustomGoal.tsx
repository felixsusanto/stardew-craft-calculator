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
import Modal from '@mui/material/Modal';
import styled from 'styled-components';
import _ from 'lodash';

const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
const checkedIcon = <CheckBoxIcon fontSize="small" />;

type Option = { label: string; id: number; };

const options: Option[] = materialCsv.map((m) => ({ label: m.material, id: m.id }));

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

const SetQtyContainer = styled.div`
  display: grid;
  gap: 0 10px;
  padding: 20px 0;
  @media(min-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

export interface CustomGoalFormPayload {
  id: number;
  name: string;
  materials: Record<string, number>;
  repeatable: boolean;
}

interface CustomGoalFormProps {
  initPayload?: CustomGoalFormPayload;
  onAddGoal?: (p: CustomGoalFormPayload) => void;
  ctaComponent?: React.ReactNode;
  className?: string;
}

const CustomGoalForm: React.FC<CustomGoalFormProps> = (props) => {
  const [name, setName] = React.useState<string>('');
  const [repeatable, setRepeatable] = React.useState<boolean>(true);
  const [materials, setMaterials] = React.useState<Option[]>([]);
  const [goals, setGoals] = React.useState<Record<string, number>>({});
  const [openModal, setOpenModal] = React.useState<boolean>(false);

  const init = () => {
    if (props.initPayload) {
      const { name, materials, repeatable } = props.initPayload;
      const keys = Object.keys(materials);
      const options = _.filter(materialCsv, (o) => {
        return keys.some(v => v === o.material);
      }).map(o => {
        return {
          label: o.material,
          id: o.id,
        }
      }) as Option[];
      setName(name);
      setRepeatable(repeatable);
      setMaterials(options);
      setGoals(materials);
    } else {
      setName('');
      setRepeatable(true);
      setMaterials([]);
      setGoals({});
    }
  };
  React.useEffect(() => {
    const keys = materials.map(o => o.label);
    setGoals(curr => {
      const t = _.pick(curr, keys);
      return t;
    });
  }, [materials]);

  React.useEffect(() => {
    init();
  }, [props.initPayload]);

  return (
    <>
      <div
        className={props.className}
        onClick={() => setOpenModal(true)}
      >
        {props.ctaComponent ? props.ctaComponent : (
          <Button variant="contained"
            sx={{mb: 2}}
          >Add Custom Goal</Button>
        )}
      </div>
      <Modal 
        open={openModal}
        onClose={() => setOpenModal(false)}
        sx={{p: 2, maxWidth: 600, margin: '0 auto'}}
      >
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
          <Autocomplete<Option, true>
            sx={{pt: 2}}
            size="small"
            multiple
            disableCloseOnSelect
            isOptionEqualToValue={(o, v) => _.isEqual(o,v)}
            options={options}
            value={materials}
            onChange={(e, v) => {
              setMaterials(v);
            }}
            renderInput={(params) => <TextField {...params} label="Select Material / Ingredients" />}
            renderOption={(props, option, { selected }) => (
              <li {...props}>
                <Checkbox
                  icon={icon}
                  checkedIcon={checkedIcon}
                  style={{ marginRight: 8 }}
                  checked={selected}
                />
                <MaterialSprite id={zeroMask(option.id)} />{' '}
                <span style={{display: 'inline-block', marginLeft: 10}}>{option.label}</span>
              </li>
            )}
          />
          <SetQtyContainer>
            {materials.map((mat, index) => {
              return (
                <Grid container spacing={1} pb={2} alignItems="center" key={index}>
                  <Grid item pt={1} flexBasis={110}>
                    <TextField
                      required
                      label="Set Quantity"
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
          </SetQtyContainer>
          {/* <pre>{JSON.stringify(goals, null, 2)}</pre> */}
          <Grid container justifyContent="flex-end">
            <Button 
              sx={{mr: 0.5}}
              variant="outlined"
              color="error"
              onClick={() => {
                setOpenModal(false);
                init();
              }}
            >Cancel</Button>
            <Button variant="outlined"
              disabled={!validate(materials.map(o => o.label), goals, name)}
              onClick={() => {
                if (props.onAddGoal) {
                  const payload: CustomGoalFormPayload = {
                    id: new Date().getTime(),
                    name,
                    repeatable,
                    materials: goals,
                  };
                  props.onAddGoal(payload);
                }
                setOpenModal(false);
                
              }}
            >Submit</Button>
          </Grid>
        </Paper>
      </Modal>
    </>
  );
};



export default CustomGoalForm;
