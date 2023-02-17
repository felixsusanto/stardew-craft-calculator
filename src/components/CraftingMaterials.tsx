import React from 'react';
import Typography from '@mui/material/Typography';
import Materials from '../csv/material.csv';
import Craftables from '../csv/craftables.csv';
import CraftableSprite, { MaterialSprite } from './CraftableSprite';
import { zeroMask } from './CraftableComponent';
import styled from 'styled-components';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import _ from 'lodash';

const FlexContainer = styled.div`
  /* display: flex;
  flex-wrap: wrap; */
  columns: 4;
  gap: 0 10px;
`;

const orderOfImportance = (x: number) => {
  // '1': 'Specific Use',
  // '<=5': 'Worth Keeping',
  // '<=15': 'Versatile',
  // '>15': 'Essential',
  if (x === 1) {
    return 'Specific Use';
  } else if (x <=5) {
    return 'Worth Keeping';
  } else if (x <=15) {
    return 'Versatile';
  } else {
    return 'Essential';
  }
};

const CraftingMaterials: React.FC = () => {
  const list = Materials.map(obj => {
    const craftableWithMaterial = _.filter(Craftables, (c) => {
      const name = obj.material;
      return c[name] !== 0;
    });
    const uses = craftableWithMaterial.length;
    const rank = orderOfImportance(uses);
    return {...obj, usedInCraftables: uses, rank}
  });
  const group = _.groupBy(list, (obj) => obj.rank);
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        List of Crafting Materials 
      </Typography>
      <FlexContainer>
        <TreeView>
          {_.orderBy(list, ['usedInCraftables', 'material'], ['desc', 'asc']).map((obj, index, arr) => {
            const craftableWithMaterial = _.filter(Craftables, (c) => {
              const name = obj.material;
              return c[name] !== 0;
            });
            return (
              <React.Fragment>
                { (index === 0 || (arr[index].rank !== arr[index - 1].rank))?  obj.rank : '' }
                <TreeItem key={obj.id} nodeId={`m-${obj.id}`}
                  label={
                    <React.Fragment>
                      <MaterialSprite id={zeroMask(obj.id)}/>{' '}
                      <Typography display="inline" variant="body2">{obj.material} ({obj.usedInCraftables})</Typography>
                    </React.Fragment>
                  }
                >
                  {craftableWithMaterial.map((craftable) => {
                    return (
                      <TreeItem
                        key={craftable.id}
                        nodeId={`c-${craftable.id}`}
                        label={
                          <Typography variant='body2' display="inline">
                            {craftable.label}
                          </Typography>
                        }
                      />
                    );
                  })}
                </TreeItem>
              </React.Fragment>
            );
          })}
        </TreeView>
      </FlexContainer>
    </React.Fragment>
  );
};

export default CraftingMaterials;
