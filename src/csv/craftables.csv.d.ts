interface Craftable {
  id: number;
  label: string;
}
declare const craftables: (Craftable & Record<string, number>)[];
export default craftables;