export const ReactionsXp = {
  love: 5,
  kiss: 5,
  airKiss: 3,
  hug: 5,
  lick: 3,
  massage: 3,
  cheek: 4,
  handhold: 4,
};

export enum MarryLimits {
  LVL_LIMIT = 10,
}

export enum MarryType {
  FRIENDS = 0,
  LOVE = 1,
  MARRIAGE = 2,
}

export enum MarryRequiredLvls {
  FRIEND = 1,
  LOVE = 4,
  MARRY = 9,
}

export const marryFormula = (lvl: number) => {
  return lvl * 150;
};
