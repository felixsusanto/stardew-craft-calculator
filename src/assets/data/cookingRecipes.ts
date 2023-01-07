export type Recipe = {
  name: string;
  ingredients: Record<string, number>;
  id: number;
};

export const recipes: Recipe[] = [
  {
    "name": "Fried Egg",
    "ingredients": {
      "Egg": 1
    },
    "id": 194
  },
  {
    "name": "Omelet",
    "ingredients": {
      "Egg": 1,
      "Milk": 1
    },
    "id": 195
  },
  {
    "name": "Salad",
    "ingredients": {
      "Leek": 1,
      "Dandelion": 1,
      "Vinegar": 1
    },
    "id": 196
  },
  {
    "name": "Cheese Cauliflower",
    "ingredients": {
      "Cauliflower": 1,
      "Cheese": 1
    },
    "id": 197
  },
  {
    "name": "Baked Fish",
    "ingredients": {
      "Sunfish": 1,
      "Bream": 1,
      "Wheat Flour": 1
    },
    "id": 198
  },
  {
    "name": "Parsnip Soup",
    "ingredients": {
      "Parsnip": 1,
      "Milk": 1,
      "Vinegar": 1
    },
    "id": 199
  },
  {
    "name": "Vegetable Medley",
    "ingredients": {
      "Tomato": 1,
      "Beet": 1
    },
    "id": 200
  },
  {
    "name": "Complete Breakfast",
    "ingredients": {
      "Fried Egg": 1,
      "Milk": 1,
      "Hashbrowns": 1,
      "Pancakes": 1
    },
    "id": 201
  },
  {
    "name": "Fried Calamari",
    "ingredients": {
      "Squid": 1,
      "Wheat Flour": 1,
      "Oil": 1
    },
    "id": 202
  },
  {
    "name": "Strange Bun",
    "ingredients": {
      "Wheat Flour": 1,
      "Periwinkle": 1,
      "Void Mayonnaise": 1
    },
    "id": 203
  },
  {
    "name": "Lucky Lunch",
    "ingredients": {
      "Sea Cucumber": 1,
      "Tortilla": 1,
      "Blue Jazz": 1
    },
    "id": 204
  },
  {
    "name": "Fried Mushroom",
    "ingredients": {
      "Common Mushroom": 1,
      "Morel": 1,
      "Oil": 1
    },
    "id": 205
  },
  {
    "name": "Pizza",
    "ingredients": {
      "Wheat Flour": 1,
      "Tomato": 1,
      "Cheese": 1
    },
    "id": 206
  },
  {
    "name": "Bean Hotpot",
    "ingredients": {
      "Green Bean": 2
    },
    "id": 207
  },
  {
    "name": "Glazed Yams",
    "ingredients": {
      "Yam": 1,
      "Sugar": 1
    },
    "id": 208
  },
  {
    "name": "Carp Surprise",
    "ingredients": {
      "Carp": 4
    },
    "id": 209
  },
  {
    "name": "Hashbrowns",
    "ingredients": {
      "Potato": 1,
      "Oil": 1
    },
    "id": 210
  },
  {
    "name": "Pancakes",
    "ingredients": {
      "Wheat Flour": 1,
      "Egg": 1
    },
    "id": 211
  },
  {
    "name": "Salmon Dinner",
    "ingredients": {
      "Salmon": 1,
      "Amaranth": 1,
      "Kale": 1
    },
    "id": 212
  },
  {
    "name": "Fish Taco",
    "ingredients": {
      "Tuna": 1,
      "Tortilla": 1,
      "Red Cabbage": 1,
      "Mayonnaise": 1
    },
    "id": 213
  },
  {
    "name": "Crispy Bass",
    "ingredients": {
      "Largemouth Bass": 1,
      "Wheat Flour": 1,
      "Oil": 1
    },
    "id": 214
  },
  {
    "name": "Pepper Poppers",
    "ingredients": {
      "Hot Pepper": 1,
      "Cheese": 1
    },
    "id": 215
  },
  {
    "name": "Bread",
    "ingredients": {
      "Wheat Flour": 1
    },
    "id": 216
  },
  {
    "name": "Tom Kha Soup",
    "ingredients": {
      "Coconut": 1,
      "Shrimp": 1,
      "Common Mushroom": 1
    },
    "id": 218
  },
  {
    "name": "Trout Soup",
    "ingredients": {
      "Rainbow Trout": 1,
      "Green Algae": 1
    },
    "id": 219
  },
  {
    "name": "Chocolate Cake",
    "ingredients": {
      "Wheat Flour": 1,
      "Sugar": 1,
      "Egg": 1
    },
    "id": 220
  },
  {
    "name": "Pink Cake",
    "ingredients": {
      "Melon": 1,
      "Wheat Flour": 1,
      "Sugar": 1,
      "Egg": 1
    },
    "id": 221
  },
  {
    "name": "Rhubarb Pie",
    "ingredients": {
      "Rhubarb": 1,
      "Wheat Flour": 1,
      "Sugar": 1
    },
    "id": 222
  },
  {
    "name": "Cookie",
    "ingredients": {
      "Wheat Flour": 1,
      "Sugar": 1,
      "Egg": 1
    },
    "id": 223
  },
  {
    "name": "Spaghetti",
    "ingredients": {
      "Wheat Flour": 1,
      "Tomato": 1
    },
    "id": 224
  },
  {
    "name": "Fried Eel",
    "ingredients": {
      "Eel": 1,
      "Oil": 1
    },
    "id": 225
  },
  {
    "name": "Spicy Eel",
    "ingredients": {
      "Eel": 1,
      "Hot Pepper": 1
    },
    "id": 226
  },
  {
    "name": "Sashimi",
    "ingredients": {
      "Any Fish": 1
    },
    "id": 227
  },
  {
    "name": "Maki Roll",
    "ingredients": {
      "Any Fish": 1,
      "Seaweed": 1,
      "Rice": 1
    },
    "id": 228
  },
  {
    "name": "Tortilla",
    "ingredients": {
      "Corn": 1
    },
    "id": 229
  },
  {
    "name": "Red Plate",
    "ingredients": {
      "Red Cabbage": 1,
      "Radish": 1
    },
    "id": 230
  },
  {
    "name": "Eggplant Parmesan",
    "ingredients": {
      "Eggplant": 1,
      "Tomato": 1
    },
    "id": 231
  },
  {
    "name": "Rice Pudding",
    "ingredients": {
      "Milk": 1,
      "Sugar": 1,
      "Rice": 1
    },
    "id": 232
  },
  {
    "name": "Ice Cream",
    "ingredients": {
      "Milk": 1,
      "Sugar": 1
    },
    "id": 233
  },
  {
    "name": "Blueberry Tart",
    "ingredients": {
      "Blueberry": 1,
      "Wheat Flour": 1,
      "Sugar": 1,
      "Egg": 1
    },
    "id": 234
  },
  {
    "name": "Autumn's Bounty",
    "ingredients": {
      "Yam": 1,
      "Pumpkin": 1
    },
    "id": 235
  },
  {
    "name": "Pumpkin Soup",
    "ingredients": {
      "Pumpkin": 1,
      "Milk": 1
    },
    "id": 236
  },
  {
    "name": "Super Meal",
    "ingredients": {
      "Bok Choy": 1,
      "Cranberries": 1,
      "Artichoke": 1
    },
    "id": 237
  },
  {
    "name": "Cranberry Sauce",
    "ingredients": {
      "Cranberries": 1,
      "Sugar": 1
    },
    "id": 238
  },
  {
    "name": "Stuffing",
    "ingredients": {
      "Bread": 1,
      "Cranberries": 1,
      "Hazelnut": 1
    },
    "id": 239
  },
  {
    "name": "Farmer's Lunch",
    "ingredients": {
      "Omelet": 1,
      "Parsnip": 1
    },
    "id": 240
  },
  {
    "name": "Survival Burger",
    "ingredients": {
      "Bread": 1,
      "Cave Carrot": 1,
      "Eggplant": 1
    },
    "id": 241
  },
  {
    "name": "Dish O' The Sea",
    "ingredients": {
      "Sardine": 2,
      "Hashbrowns": 1
    },
    "id": 242
  },
  {
    "name": "Miner's Treat",
    "ingredients": {
      "Cave Carrot": 2,
      "Sugar": 1,
      "Milk": 1
    },
    "id": 243
  },
  {
    "name": "Roots Platter",
    "ingredients": {
      "Cave Carrot": 1,
      "Winter Root": 1
    },
    "id": 244
  },
  {
    "name": "Triple Shot Espresso",
    "ingredients": {
      "Coffee": 3
    },
    "id": 253
  },
  {
    "name": "Seafoam Pudding",
    "ingredients": {
      "Flounder": 1,
      "Midnight Carp": 1,
      "Squid Ink": 1
    },
    "id": 265
  },
  {
    "name": "Algae Soup",
    "ingredients": {
      "Green Algae": 4
    },
    "id": 456
  },
  {
    "name": "Pale Broth",
    "ingredients": {
      "White Algae": 2
    },
    "id": 457
  },
  {
    "name": "Plum Pudding",
    "ingredients": {
      "Wild Plum": 2,
      "Wheat Flour": 1,
      "Sugar": 1
    },
    "id": 604
  },
  {
    "name": "Artichoke Dip",
    "ingredients": {
      "Artichoke": 1,
      "Milk": 1
    },
    "id": 605
  },
  {
    "name": "Stir Fry",
    "ingredients": {
      "Cave Carrot": 1,
      "Common Mushroom": 1,
      "Kale": 1,
      "Oil": 1
    },
    "id": 606
  },
  {
    "name": "Roasted Hazelnuts",
    "ingredients": {
      "Hazelnut": 3
    },
    "id": 607
  },
  {
    "name": "Pumpkin Pie",
    "ingredients": {
      "Pumpkin": 1,
      "Wheat Flour": 1,
      "Milk": 1,
      "Sugar": 1
    },
    "id": 608
  },
  {
    "name": "Radish Salad",
    "ingredients": {
      "Oil": 1,
      "Vinegar": 1,
      "Radish": 1
    },
    "id": 609
  },
  {
    "name": "Fruit Salad",
    "ingredients": {
      "Blueberry": 1,
      "Melon": 1,
      "Apricot": 1
    },
    "id": 610
  },
  {
    "name": "Blackberry Cobbler",
    "ingredients": {
      "Blackberry": 2,
      "Sugar": 1,
      "Wheat Flour": 1
    },
    "id": 611
  },
  {
    "name": "Cranberry Candy",
    "ingredients": {
      "Cranberries": 1,
      "Apple": 1,
      "Sugar": 1
    },
    "id": 612
  },
  {
    "name": "Bruschetta",
    "ingredients": {
      "Bread": 1,
      "Oil": 1,
      "Tomato": 1
    },
    "id": 618
  },
  {
    "name": "Coleslaw",
    "ingredients": {
      "Red Cabbage": 1,
      "Vinegar": 1,
      "Mayonnaise": 1
    },
    "id": 648
  },
  {
    "name": "Fiddlehead Risotto",
    "ingredients": {
      "Oil": 1,
      "Fiddlehead Fern": 1,
      "Garlic": 1
    },
    "id": 649
  },
  {
    "name": "Poppyseed Muffin",
    "ingredients": {
      "Poppy": 1,
      "Wheat Flour": 1,
      "Sugar": 1
    },
    "id": 651
  },
  {
    "name": "Chowder",
    "ingredients": {
      "Clam": 1,
      "Milk": 1
    },
    "id": 727
  },
  {
    "name": "Fish Stew",
    "ingredients": {
      "Crayfish": 1,
      "Mussel": 1,
      "Periwinkle": 1,
      "Tomato": 1
    },
    "id": 728
  },
  {
    "name": "Escargot",
    "ingredients": {
      "Snail": 1,
      "Garlic": 1
    },
    "id": 729
  },
  {
    "name": "Lobster Bisque",
    "ingredients": {
      "Lobster": 1,
      "Milk": 1
    },
    "id": 730
  },
  {
    "name": "Maple Bar",
    "ingredients": {
      "Maple Syrup": 1,
      "Sugar": 1,
      "Wheat Flour": 1
    },
    "id": 731
  },
  {
    "name": "Crab Cakes",
    "ingredients": {
      "Crab": 1,
      "Wheat Flour": 1,
      "Egg": 1,
      "Oil": 1
    },
    "id": 732
  },
  {
    "name": "Shrimp Cocktail",
    "ingredients": {
      "Tomato": 1,
      "Shrimp": 1,
      "Wild Horseradish": 1
    },
    "id": 733
  },
  {
    "name": "Ginger Ale",
    "ingredients": {
      "Ginger": 3,
      "Sugar": 1
    },
    "id": 903
  },
  {
    "name": "Banana Pudding",
    "ingredients": {
      "Banana": 1,
      "Milk": 1,
      "Sugar": 1
    },
    "id": 904
  },
  {
    "name": "Mango Sticky Rice",
    "ingredients": {
      "Mango": 1,
      "Coconut": 1,
      "Rice": 1
    },
    "id": 905
  },
  {
    "name": "Poi",
    "ingredients": {
      "Taro Root": 4
    },
    "id": 906
  },
  {
    "name": "Tropical Curry",
    "ingredients": {
      "Coconut": 1,
      "Pineapple": 1,
      "Hot Pepper": 1
    },
    "id": 907
  },
  {
    "name": "Squid Ink Ravioli",
    "ingredients": {
      "Squid Ink": 1,
      "Wheat Flour": 1,
      "Tomato": 1
    },
    "id": 921
  }
]