# Namma Kannada: a language journal

A gamified, native-script-first Kannada course built as an illustrated travel journal:
20 levels, 220 sublevels (10 required plus 1 optional bonus per level) and 2,200
exercises, with a stamp for every sublevel and a postcard for every level.

```sh
npm install
npm run dev      # http://localhost:5173
npm test         # engine unit tests + UI integration tests (jsdom)
npm run build    # type-check + production build (PWA)
```

## Architecture: three layers

```
src/
  content/            Layer 3: language content (no UI, no logic)
    schema.ts         LanguagePack contract: config, letters, vocab, phrases,
                      sentences, readings, level specs, postcards
    validate.ts       structural + referential validation, import sanitiser
    registry.ts       built-in packs + imported packs (localStorage)
    packs/kn/         Kannada: 758 words (661 from the book), 59 letters, 38 phrases, 67 sentences, 3 readings
      illustrations/  every picture (word art + postcards), one file each, plus catalog.json
      phonetics.ts    English-friendly respelling ("na-mas-kaa-ra") for beginners
    packs/hi/         small Hindi starter pack (proves the engine is language-agnostic)
  engine/             Layer 2: learning engine (pure TypeScript, unit-tested)
    curriculum.ts     level specs → sublevels → 10 ID-only exercise plans
    exercises.ts      plans → renderable exercises (distractors, examples)
    progress.ts       state transitions: answers, lives, XP, streaks, stamps,
                      postcards, achievements; explicit reward events
    srs.ts            Leitner spaced repetition (1/3/7/16/35 days)
    illustration.ts   art resolution: upload → bespoke SVG → topic motif
    store.tsx         the only React bridge (context + persistence)
  ui/ exercises/ screens/ app/   Layer 1: design system, exercise renderers, 26 screens
```

Rules enforced by tests:

- **No language content in Layers 1–2.** `app.test.tsx` fails if any Kannada or
  Devanagari character appears in `ui/`, `exercises/`, `screens/`, `engine/` or `app/`.
- **The curriculum must add up.** The engine tests assert 20 levels, ≥10 sublevels per
  level, exactly 10 exercises per sublevel (2,000 required), and that every exercise
  materialises.
- **Exercises reference IDs, never copies.** Plans hold `vocabIds` / `sentenceId` /
  `letterId`, and exercises are materialised from the pack at play time.

### Adding a language

Write a `LanguagePack` (see `schema.ts` and `packs/hi`) and import it from
**Settings → Languages**. It is validated first, and raw SVG is stripped from imported
packs, so artwork comes from generated motifs or uploaded raster images. Progress is
kept separately per language.

### Illustrations

All Kannada artwork is in `src/content/packs/kn/illustrations/`. Each word looks for a file
named after its English meaning (`coffee.svg`, `elephant.png`). `catalog.json` lists every word with its expected
file name and an art-direction description. Drop a file in and rebuild; see that folder's README.

### Content source

Vocabulary comes from Lingadevaru Halemane, *Kannada: A Self Instructional Course*
(Kannada Development Authority, 3rd ed. 2012), extracted from `kannada_svayam_bodhane.pdf`.
See `tools/pdf-extract/README.md` for the pipeline, which handles the PDF's legacy
Nudi font encoding.
