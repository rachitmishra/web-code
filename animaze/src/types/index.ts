export type GameMode = "animals" | "birds" | "colors" | "piano";

export interface ColorItem {
  name: string;
  hex: string;
  sound: string;
}

export interface Animal {
  name: string;
  emoji: string;
  sound: string;
  imageUrl?: string;
}

export interface Bird extends Animal {}
