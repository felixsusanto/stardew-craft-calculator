import React from 'react';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import MaterialNeeded from './MaterialNeeded';
import { Material } from '../csv/craftables.csv';
import { CsvType } from './MaterialNeeded';

type TotalMaterialProps = {
  total: Material;
  csvType?: CsvType;
};

const TotalMaterial: React.FC<TotalMaterialProps> = (props) => {
  if (!Object.keys(props.total).length) return null;
  console.log('totalProps', props.total);
  return (
    <Paper elevation={4} sx={{ p: 2, mb: 2}}>
      <Typography variant="h6" gutterBottom>
        Grand Total 
      </Typography>
      <MaterialNeeded 
        csvType={props.csvType}
        material={props.total} 
      />
    </Paper>
  );
};

export default TotalMaterial;
