import React from 'react';
import { recipes } from "../assets/data/cookingRecipes";
import CraftableComponent from '../components/CraftableComponent';
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
              csvType='INGREDIENTS'
              spriteType='MATERIAL'
              label={obj.name}
              purchasable=''
              id={obj.id}
              material={obj.ingredients}
              onClose={() => {}}
              onQtyChange={() => {}}
            />
          </>
        );
      })}
    </Container>
  );
};

export default RecipesCalculator;