import React, { useState } from 'react';
import _ from 'lodash';
import { CraftableBase, Material } from '../App';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import DeleteIcon from '@mui/icons-material/Delete';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import styled from 'styled-components';
import materialCsv from '../csv/material.csv';

const zeroMask = (x: number) => {
  if (x < 10) {
    return `00${x}`;
  } else if (x < 100) {
    return `0${x}`;
  }
  return x + '';
}

type CraftableProps = CraftableBase & {
  material: Material;
  onQtyChange: (v: Material) => void;
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
  }
  .text {
    margin-left: 8px;
    flex: 1;
    align-self: flex-end;
  }
`;

const CraftableComponent: React.FC<CraftableProps> = (props) => {
  
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
    props.onQtyChange(clone);
    setMaterialNeeded(filtered);
  }, [needed])
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
  }
  .txt {
    flex: 1;
  }
  .qty {
    padding-left: 4px;
  }
`;

type MaterialCsv = {
  id: number;
  material: string;
  craftable: boolean;
};
export const MaterialNeeded: React.FC<MaterialNeededProps> = (p) => {
  React.useEffect(() => {
  }, []);
  if (!p.material) return null;
  const keys = Object.keys(p.material);
  if (keys.length === 0) return null;


  return (
    <div style={{display: 'flex', flexWrap: 'wrap', gap: '0 20px'}}>
      {keys.map((key) => {
        const material = _.find(materialCsv as MaterialCsv[], {material: key});
        if (!material) return null;
        return (
          <SimpleRow key={key}>
            <div className="img">
              <img src={`/img/object/${zeroMask(material.id)}.png`} />
            </div>
            <div className="txt">
              <Typography variant="body2">
                {material.material}
              </Typography>
            </div>
            <div className="qty">
              <Typography variant="body2">
                {p.material && p.material[key]}
              </Typography>

            </div>
          </SimpleRow>
        );
      })}
    </div>
  );
};

export default CraftableComponent;
