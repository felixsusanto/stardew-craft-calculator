enum Season {
  EMPTY = '',
  SPRING = 'spring',
  SUMMER = 'summer',
  FALL = 'fall',
  WINTER = 'winter',
};

enum Seller {
  PIERRE = 'pierre',
  KROBUS = 'krobus',
  ROBIN = 'robin',
  CLINT = 'clint',
}

interface Material {
  id: number;
  material: string;
  craftable: boolean;
  price: string;
  season: Season;
  seller: Seller;
  link: string;
}

declare const material: Material[];
export default material;