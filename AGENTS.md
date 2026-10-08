# Repository conventions

- Do not update README.md when adding new models.
- This repository owns model strings, parameter schemas, dimensions, defaults,
  and validation. Geometry generation and visual snapshots belong in
  tscircuit/jscad-electronics; do not add meshes or renderer dependencies here.
- Test parameter contracts without describe blocks. Keep reusable assertions in
  tests/fixtures.
- New model contracts belong in `src/models/<name>/` with `schema.ts`,
  `parse-model-string.ts`, `index.ts`, and `register.ts`. Use `defineModel` for
  the typed name/schema/parser descriptor, and export `model` plus
  `register(registry)` only from `register.ts`.
- Keep each model's public API in its `index.ts`; do not re-export the generic
  `model` or `register` names. Registry wiring, root model exports, and the
  typed model-definition union are generated from `*/register.ts` discovery.
- Do not edit or commit `src/generated/`. Normal test, typecheck, formatting,
  and build commands generate automatically; use `bun run generate` explicitly
  or `bun run generate:watch` while adding/removing model folders. See
  [docs/model-registration.md](docs/model-registration.md) for the workflow.

Run `bun test`, `bun run typecheck`, `bun run format:check`, and `bun run build`
before submitting changes. Build output is generated: never commit dist/ or the
root index.js, index.d.ts and index.js.map files, or types/. The prepare/prepack scripts
stage the root entrypoints for the modelprinter package; dist/ is never published.
Lockfile generation is disabled in bunfig.toml; do not commit bun.lock or bun.lockb.

## Model-string API design

- Use standard or de-facto designations, never manufacturer-specific model names.
  Keep shorthand recognition and expansion inside the model's own directory;
  register an optional pure `normalizeString` hook rather than adding model
  imports or special cases to the central parser. Existing models without the
  hook must retain their raw parameters and parsing behavior.
- Prefer value-free flags over enum parameters: use `_open` or
  `_bothsidesopen`, not `_closure(open)`. Normalize selectors into explicit
  boolean properties and reject conflicting or repeated selectors.
- Radial bearings accept compact envelopes such as `ballbearing608` and
  conventional suffixes Z, ZZ/2Z, RS and 2RS, case insensitive. Match a supported
  envelope code before its suffix: `6002rs` and `60022rs` differ. These aliases
  do not promise any manufacturer's seal contact, preload or lubrication.
- Expand radial shorthand into a complete string with explicit millimeter
  dimensions and face flags. For example, `ballbearing625zz` becomes
  `ballbearing_id5mm_od16mm_w5mm_bothsidesshielded`. The top face is Z=width;
  the bottom is Z=0. Z/RS selects a bottom shield/seal; ZZ/2Z/2RS selects both.
  Bare bearings open both faces. Explicit global flags override suffix defaults,
  and explicit per-face flags override globals independent of token order.
- Normalized radial props contain one true flag per face and false for the
  other two: `topSideOpen`/`topSideShielded`/`topSideSealed` and their bottom-side
  counterparts. Input also accepts `bothSidesOpen`, `bothSidesShielded` and
  `bothSidesSealed`; canonical strings collapse equal faces to a both-side flag.
  Validate duplicate tokens and code/dimension conflicts before expansion erases
  them. Check compact/full-form equivalence, normalization idempotency, schema
  roundtrips, asymmetric faces and unchanged behavior of existing models.
  Canonical lengths must use plain decimals, including tiny or large dimensions.
- When correcting syntax for a released model, add model-local value-free flag
  aliases and retain its existing JSON fields and input/output types. Renderers
  may depend on enum fields such as `threadHand` or `mount`; switching those
  fields to booleans requires a separately planned compatibility migration.
  Keep legacy strings and their raw `.params()` unchanged. Normalize only the
  new syntax, validate duplicates/conflicts before removing redundant defaults,
  and test new/old JSON equality plus downstream rendering. Keep standards,
  metric designations, and tolerance classes as identifiers rather than flags.
