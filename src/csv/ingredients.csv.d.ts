import { Material } from './material.csv';

interface Ingredients extends Material {
  registered_id: number;
  manual_id: number;
}

declare const ingredients: Ingredients[];
export default ingredients;