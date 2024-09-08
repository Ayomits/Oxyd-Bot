export const ReactionsXp = {
  love: 10,
  kiss: 10,
  airKiss: 5,
  hug: 5,
  lick: 5,
  massage: 4,
  cheek: 4,
};

export enum MarryLimits {
  LVL_LIMIT = 10,
}

export enum MarryRequiredLvls {
  FRIEND = 1,
  LOVE = 4,
  MARRY = 9
}

export enum MarryType {
  FRIENDS = 0,
  LOVE = 1,
  MARRIAGE = 2,
}

export const marryFormula = (lvl: number) => {
  return lvl * 100;
};
