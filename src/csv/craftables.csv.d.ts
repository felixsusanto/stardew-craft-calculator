export interface CraftableBase {
  id: number;
  label: string;
  group: string;
  purchasable: string;
  priority: string;
}
export type CraftableMaterial = Record<string, number>;
declare const craftables: (CraftableBase & CraftableMaterial)[];
export default craftables;