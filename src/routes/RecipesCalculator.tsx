import React from 'react';
import { recipes } from "../assets/data/cookingRecipes";
import CraftableComponent, { zeroMask } from '../components/CraftableComponent';
import { MaterialSprite } from '../components/CraftableSprite';
import { Container } from './root';


const RecipesCalculator = () => {
  React.useEffect(() => {
  }, []);
  return (
    <Container>
      { recipes.map((obj) => {
        return (
          <>
            <CraftableComponent 
              spriteType='MATERIAL'
              label={obj.name}
              purchasable=''
              id={obj.id}
              material={obj.ingredients}
              onClose={() => {}}
              onQtyChange={() => {}}
            />
            {JSON.stringify(obj.ingredients, null, 2)}
          </>
        );
      })}
    </Container>
  );
};

export default RecipesCalculator;