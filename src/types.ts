export type Primative = string | boolean | number | null;

export type Categories = string[];

export type HashMapValue =
  | HashMap<HashMapValue>
  | Primative
  | (HashMap<HashMapValue> | Primative)[];

export interface HashMap<T = HashMapValue> {
  [key: string]: T;
}
