import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import { MaterialNeeded } from './CraftableComponent';
import { Material } from '../App';

type TotalMaterialProps = {
  total: Material
};

const TotalMaterial: React.FC<TotalMaterialProps> = (props) => {
  if (!Object.keys(props.total).length) return null;
  return (
    <Paper elevation={4} sx={{ p: 2, mb: 2}}>
      <Typography variant="h6" gutterBottom>
        Total 
      </Typography>
      <MaterialNeeded material={props.total} />  
    </Paper>
  );
};

export default TotalMaterial;
