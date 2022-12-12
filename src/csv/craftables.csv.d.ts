export interface CraftableBase {
  id: number;
  label: string;
  group: string;
}
export type Material = Record<string, number>;
declare const craftables: (CraftableBase & Material)[];
export default craftables;