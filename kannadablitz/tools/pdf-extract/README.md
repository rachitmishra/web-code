# Extracting vocabulary from the Halemane course PDF

`kannada_svayam_bodhane.pdf` (Lingadevaru Halemane, *Kannada: A Self Instructional Course*,
Kannada Development Authority) stores Lessons 1–10 in Roman transliteration and
Lessons 11–25 in the legacy **Nudi** ASCII font encoding, so plain text extraction
gives garbled Kannada. This pipeline turns it into `src/content/packs/kn/vocab.json`.

| Step | Script | Output |
| --- | --- | --- |
| 1. Text | `pypdf` (see below) | `text.txt` |
| 2. Vocab lines, Nudi → Unicode | `extract.py` + `nudi.py` | `vocab.json` (721 raw) |
| 3. Clean, dedupe, romanise | `clean.py` + `translit.py` | `clean.json` (672) |
| 4. Manual corrections (OCR noise, book typos, glosses) | `fix.py` | `final.json` (661) |
| 5. Merge with curated core words, tag topics/POS/art | `build_vocab.py` | `vocab.json` (758) |

The Nudi glyph table is Aravinda VK's GPL-3 `ascii2unicode` mapping. It is **not
vendored**; download it and point `NUDI_MAPPING` at it. `nudi.py` reads it with `ast`
and never executes it. On top of that mapping, `nudi.py` adds reph (arkavattu `ð`)
reordering, which the reference converter gets wrong (e.g. ಕನ್ರಾಟಕ → ಕರ್ನಾಟಕ).

```sh
mkdir -p /tmp/a2u && curl -so /tmp/a2u/nudi.py \
  https://raw.githubusercontent.com/aravindavk/ascii2unicode/master/old_ref/mappings/nudi.py
export NUDI_MAPPING=/tmp/a2u/nudi.py
python3 -I -c "import pypdf;r=pypdf.PdfReader('kannada_svayam_bodhane.pdf');open('/tmp/text.txt','w').write(''.join(f'\n=====PAGE {i+1}=====\n'+(p.extract_text() or '') for i,p in enumerate(r.pages)))"
python3 -I tools/pdf-extract/extract.py /tmp/text.txt tools/pdf-extract/nudi.py /tmp/vocab.json
python3 -I tools/pdf-extract/clean.py /tmp/vocab.json tools/pdf-extract/translit.py /tmp/clean.json > /tmp/review.txt
python3 -I tools/pdf-extract/fix.py /tmp/clean.json tools/pdf-extract/translit.py /tmp/final.json
# build_vocab.py also needs the curated core list exported as JSON (existing.json: {"vocab": [...]})
```

`fix.py` holds index-based corrections against `clean.json`. If the extractor changes,
re-review `/tmp/review.txt` and update the indices.
