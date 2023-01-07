import React from 'react';
import { recipes } from "../assets/data/cookingRecipes";
import CraftableComponent from '../components/CraftableComponent';
import CalculatorLayout from './CalculatorLayout';
import { Container } from './root';


const RecipesCalculator = () => {
  React.useEffect(() => {
  }, []);
  return <CalculatorLayout />;
  return (
    <Container>
      { recipes.map((obj) => {
        return (
          <React.Fragment key={obj.name}>
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
          </React.Fragment>
        );
      })}
    </Container>
  );
};

export default RecipesCalculator;