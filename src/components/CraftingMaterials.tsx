import React from 'react';
import Typography from '@mui/material/Typography';
import Materials from '../csv/material.csv';
import { MaterialSprite } from './CraftableSprite';
import { zeroMask } from './CraftableComponent';
import styled from 'styled-components';

const FlexContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0 10px;
  > div {
    flex-basis: calc(33.33% - 10px);
  }
`;

const CraftingMaterials: React.FC = () => {
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        List of Crafting Materials 
      </Typography>
      <FlexContainer>
        {Materials.map((obj) => {
          return (
            <div key={obj.id}>
              <MaterialSprite id={zeroMask(obj.id)}/>{' '}
              <Typography display="inline" variant="body2">{obj.material}</Typography>
            </div>
          );
        })}
      </FlexContainer>
    </React.Fragment>
  );
};

export default CraftingMaterials;
