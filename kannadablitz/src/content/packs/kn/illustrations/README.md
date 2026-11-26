# Kannada illustrations

All artwork for the Kannada pack is in this folder, one file per picture.

| File | Used for |
| --- | --- |
| `<name>.svg` / `.png` / `.jpg` / `.webp` | Word cards, matching, flashcards, Daily Word. `<name>` is the word's English meaning as a slug: `coffee.svg`, `elephant.svg`, `rice-field.svg`. |
| `postcard-<place>.svg` | The postcard awarded for a level (`postcard-hampi.svg`). Landscape, 360 × 190. |
| `catalog.json` | Every word, the file name it expects, its description (an art-direction brief), and whether the file exists yet. |

## Replacing or adding a picture

1. Find the word in `catalog.json`. Its `name` is the file to create, and `description` is the brief.
2. Save the image here as `<name>.svg` (or `.png`, `.jpg`, `.webp`). A raster file wins over an SVG of the same name.
3. Run `python3 tools/illustrations/catalog.py` to refresh the catalogue. The app picks the file up on the next build. No code changes are needed.

Words without a file fall back to a generated topic motif, so nothing breaks while art is in progress.

Several words can share one picture: give a word an explicit `"art": "<name>"` in `../vocab.json`
(for example *calf* uses `cow`).

## Style

Square 1:1 (`viewBox="0 0 200 200"`), flat shapes, a fine maroon outline (`#3B1214`) on sandalwood
paper (`#FFF7E6`), with accents of kumkuma red (`#C8102E`), arishina yellow (`#F2B705`) and leaf
green (`#2E7A3C`). Use no text or letters. Keep SVGs self-contained, with no scripts and no external references.
