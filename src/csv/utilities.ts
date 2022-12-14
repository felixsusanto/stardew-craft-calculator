import _ from 'lodash';
import materialCsv from './material.csv';
import * as Papa from 'papaparse';

type InputData = (Record<string, number | string>)[];

export const newData: InputData = [
  {
    label: "Bone Mill",
    "Bone Fragment": 10,
    "Clay": 3,
    "Stone": 20,
  },
  {
    label: "Bug Steak",
    "Bug Meat": 10,
  },
  {
    label: "Cask",
    "Wood": 20,
    "Hardwood": 1,
  },
  {
    label: "Cookout Kit",
    "Wood": 15,
    "Fiber": 10,
    "Coal": 3,
  },
  {
    label: "Dark Sign",
    "Bat Wing": 5,
    "Bone Fragment": 5,
  },
  {
    label: "Deluxe Scarecrow",
    "Wood": 50,
    "Iridium Ore": 1,
    "Fiber": 40,
  },
  {
    label: "Fairy Dust",
    "Diamond": 1,
    "Fairy Rose": 1,
  },
  {
    label: "Fall Seeds",
    "Blackberry": 1,
    "Common Mushroom": 1,
    "Hazelnut": 1,
    "Wild Plum": 1,
  },
  {
    label: "Farm Computer",
    "Dwarf Gadget": 1,
    "Battery Pack": 1,
    "Refined Quartz": 10,
  },
  {
    label: "Fiber Seeds",
    "Mixed Seeds": 1,
    "Sap": 5,
    "Clay": 1,
  },
  {
    label: "Garden Pot",
    "Clay": 1,
    "Stone": 10,
    "Refined Quartz": 1,
  },
  {
    label: "Geode Crusher",
    "Gold Bar": 2,
    "Stone": 50,
    "Diamond": 1,
  },
  {
    label: "Glowstone Ring",
    "Solar Essence": 5,
    "Iron Bar": 5,
  },
  {
    label: "Gold Bar",
    "Gold Ore": 5,
    "Coal": 1,
  },
  {
    label: "Heavy Tapper",
    "Hardwood": 30,
    "Radioactive Bar": 1,
  },
  {
    label: "Hopper",
    "Hardwood": 10,
    "Iridium Bar": 1,
    "Radioactive Bar": 1,
  },
  {
    label: "Mini-Jukebox",
    "Iron Bar": 2,
    "Battery Pack": 1,
  },
  {
    label: "Mini-Obelisk",
    "Hardwood": 30,
    "Solar Essence": 20,
    "Gold Bar": 3,
  },
  {
    label: "Monster Musk",
    "Slime": 30,
    "Bat Wing": 30,
  },
  {
    label: "Ostrich Incubator",
    "Bone Fragment": 50,
    "Hardwood": 50,
    "Cinder Shard": 20,
  },
  {
    label: "Quality Bobber",
    "Copper Bar": 1,
    "Sap": 20,
    "Solar Essence": 5,
  },
  {
    label: "Solar Panel",
    "Refined Quartz": 10,
    "Iron Bar": 5,
    "Gold Bar": 5,
  },
  {
    label: "Spring Seeds",
    "Wild Horseradish": 1,
    "Daffodil": 1,
    "Leek": 1,
    "Dandelion": 1,
  },
  {
    label: "Stone Chest",
    "Stone": 50,
  },
  {
    label: "Stone Sign",
    "Stone": 25,
  },
  {
    label: "Summer Seeds",
    "Spice Berry": 1,
    "Grape": 1,
    "Sweet Pea": 1,
  },
  {
    label: "Tea Sapling",
    "Wild Seeds (Any)": 2,
    "Fiber": 5,
    "Wood": 5,
  },
  {
    label: "Thorns Ring",
    "Bone Fragment": 50,
    "Stone": 50,
    "Gold Bar": 1,
  },
  {
    label: "Tree Fertilizer",
    "Fiber": 5,
    "Stone": 5,
  },
  {
    label: "Wedding Ring",
    "Iridium Bar": 5,
    "Prismatic Shard": 1,
  },
  {
    label: "Winter Seeds",
    "Crocus": 1,
    "Crystal Fruit": 1,
    "Snow Yam": 1,
    "Winter Root": 1,
  },
  {
    label: "Wood Sign",
    "Wood": 25,
  },
];

export const newestData: InputData = [
  {
    label: "Warp Totem: Desert",
    "Iridium Bar": 10,
    "Hardwood": 2,
    "Coconut": 1,
    "Iridium Ore": 4,
  },
  {
    label: "Warp Totem: Island",
    "Hardwood": 5,
    "Dragon Tooth": 1,
    "Ginger": 1,
  },
  {
    label: "Magic Bait",
    "Radioactive Ore": 1,
    "Bug Meat": 3,
  },
  {
    label: "Deluxe Fertilizer",
    "Iridium Bar": 1,
    "Sap": 4,
  },
  {
    label: "Hyper Speed-Gro",
    "Radioactive Ore": 1,
    "Bone Fragment": 3,
    "Solar Essence": 1,
  },
  {
    label: "Deluxe Retaining Soil",
    "Stone": 5,
    "Fiber": 3,
    "Clay": 1,
  }
]

const getKeys = (d: InputData) => {
  const k = d
    .map(obj => {
      const { label, ...rest } = obj;
      return Object.keys(rest); 
    })
    .reduce((acc, curr) => [...acc, ...curr])
  ;
  const unique = [...(new Set(k)).values()]
    .reduce((acc, curr) => {
      acc[curr] = 0;
      return acc;
    }, {} as Record<string, 0>)
  ;
  return unique;
}

export const generateNewItems = (d: InputData) => {
  const fields = materialCsv
    .map(v => v.material)
  ;
  const base = fields.reduce((acc, curr) => {
      acc[curr] = 0;
      return acc;
    }, {} as Record<string, number>)
  ;
  const basePlus = {...base, ...getKeys(d)};

  const res = d.map(obj => {
    const { label, ...rest } = obj;
    return {
      label,
      ...basePlus,
      ...rest,
    };
  });
  const csv = Papa.unparse(res, { header: true, delimiter: '\t' });
  return csv;
};
