import type { Bird } from "../types";

export const BIRD_MAP: Record<string, Array<Bird>> = {
  a: [{ name: "Albatross", emoji: "🪽", sound: "Squawk! I can fly for a long time." }],
  b: [{ name: "Blue Jay", emoji: "🐦", sound: "Jay! Jay! Look at my blue feathers." }],
  c: [{ name: "Cardinal", emoji: "🐦‍⬛", sound: "Chirp chirp! I am a bright red bird." }],
  d: [{ name: "Duck", emoji: "🦆", sound: "Quack! Quack! I love to swim." }],
  e: [{ name: "Eagle", emoji: "🦅", sound: "Screee! I am the king of the sky." }],
  f: [{ name: "Flamingo", emoji: "🦩", sound: "Squawk! I stand on one leg." }],
  g: [{ name: "Goose", emoji: "🪿", sound: "Honk! Honk! Get out of my way!" }],
  h: [{ name: "Hummingbird", emoji: "🐦", sound: "Hummmm... I'm so fast!" }],
  i: [{ name: "Ibis", emoji: "🦩", sound: "Honk! I have a long curved beak." }],
  j: [{ name: "Jackdaw", emoji: "🐦", sound: "Caw! I am a very clever bird." }],
  k: [{ name: "Kingfisher", emoji: "🐦", sound: "Splash! I just caught a fish!" }],
  l: [{ name: "Lark", emoji: "🐦", sound: "Twee twee! I sing in the morning." }],
  m: [{ name: "Macaw", emoji: "🦜", sound: "Squawk! I am a colorful parrot!" }],
  n: [{ name: "Nightingale", emoji: "🐦", sound: "Trill... my song is beautiful." }],
  o: [{ name: "Owl", emoji: "🦉", sound: "Hoo hoo! I'm watching you." }],
  p: [{ name: "Penguin", emoji: "🐧", sound: "Waddle waddle! It's cold here!" }],
  q: [{ name: "Quail", emoji: "🐦", sound: "Whistle! I hide in the tall grass." }],
  r: [{ name: "Robin", emoji: "🐦", sound: "Chirp! Spring is here!" }],
  s: [{ name: "Swan", emoji: "🦢", sound: "Honk! I am very graceful." }],
  t: [{ name: "Toucan", emoji: "🦜", sound: "Squawk! Look at my big beak!" }],
  u: [{ name: "Umbrellabird", emoji: "🐦", sound: "Boom! I have a big crest." }],
  v: [{ name: "Vulture", emoji: "🦅", sound: "Caw! I'm circling high above." }],
  w: [{ name: "Woodpecker", emoji: "🐦", sound: "Tap tap tap! I'm looking for bugs." }],
  x: [{ name: "Xantus", emoji: "🐦", sound: "Chirp! I'm a rare little bird." }],
  y: [{ name: "Yellowhammer", emoji: "🐦", sound: "Twee twee! I have yellow feathers." }],
  z: [{ name: "Zebra Finch", emoji: "🐦", sound: "Beep beep! I'm a tiny bird with stripes." }],
};

export const ALL_BIRDS: Bird[] = Object.values(BIRD_MAP).flat();
