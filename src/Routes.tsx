export enum RouteUrl {
  CRAFTABLES = 'craftables',
  RECIPES = 'recipes',
};

const Routes: Record<RouteUrl, string> = {
  [RouteUrl.CRAFTABLES]: 'Craftable',
  [RouteUrl.RECIPES]: 'Cooking Recipes'
};

export default Routes;