import React from 'react';
import Typography from '@mui/material/Typography';
import { MaterialSprite } from './CraftableSprite';
import { zeroMask } from './CraftableComponent';
import styled from 'styled-components';
import TreeView from '@mui/lab/TreeView';
import TreeItem from '@mui/lab/TreeItem';
import _ from 'lodash';
import { recipes } from '../assets/data/cookingRecipes';
import ingredients from '../csv/ingredients.csv';

const FlexContainer = styled.div`
  /* display: flex;
  flex-wrap: wrap; */
  columns: 1;
  gap: 0 10px;
  @media (min-width: 800px) {
    columns: 2;
  }
  @media (min-width: 1200px) {
    columns: 3;
  }
  @media (min-width: 1600px) {
    columns: 4;
  }
  
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

const RecipeIngredients: React.FC = () => {
  const list = ingredients.map(obj => {
    const craftableWithMaterial = _.filter(recipes, (c) => {
      const name = obj.name;
      return typeof c.ingredients[name] === 'number' && c.ingredients[name] !== 0;
    });
    const uses = craftableWithMaterial.length;
    const rank = orderOfImportance(uses);
    return {...obj, usedInCraftables: uses, rank}
  });
  console.debug('list', list);
  const group = _.groupBy(list, (obj) => obj.rank);
  return (
    <React.Fragment>
      <Typography variant="h6" gutterBottom>
        List of Ingredients 
      </Typography>
      <FlexContainer>
        <TreeView>
          {_.orderBy(list, ['usedInCraftables', 'material'], ['desc', 'asc']).map((obj, index, arr) => {
            const craftableWithMaterial = _.filter(recipes, (c) => {
              const name = obj.name;
              return typeof c.ingredients[name] === 'number' && c.ingredients[name] !== 0;
            });
            return (
              <React.Fragment>
                { (index === 0 || (arr[index].rank !== arr[index - 1].rank))?  obj.rank : '' }
                <TreeItem key={obj.id} nodeId={`m-${obj.id}`}
                  label={
                    <React.Fragment>
                      <MaterialSprite id={zeroMask(obj.id)}/>{' '}
                      <Typography display="inline" variant="body2">{obj.name} ({obj.usedInCraftables})</Typography>
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
                            {craftable.name}
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

export default RecipeIngredients;
