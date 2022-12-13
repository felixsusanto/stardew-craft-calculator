enum Season {
  EMPTY = '',
  SPRING = 'spring',
  SUMMER = 'summer',
  FALL = 'fall',
  WINTER = 'winter',
};

interface Material {
  id: number;
  material: string;
  craftable: boolean;
  price: string;
  season: Season;
}

declare const material: Material[];
export default material;