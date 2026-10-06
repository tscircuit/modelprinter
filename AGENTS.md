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
