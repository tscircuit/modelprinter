# Repository conventions

- Do not update README.md when adding new models.
- Render all visual snapshots with poppygl.
- Every visual snapshot must show exactly one model in exactly four views and include a title block displaying its modelprinter string. Use separate snapshot files for different models.
- Test files must never use describe blocks and must contain exactly one visual test per file.
- Keep reusable assertions and rendering helpers in tests/fixtures. Each visual test should compare its rendered PNG against a committed snapshot.

Run `bun test`, `bun run typecheck`, `bun run format:check`, and `bun run build`
before submitting changes. Build output is generated: never commit dist/ or the
root index.js, index.d.ts and index.js.map files. The prepack script stages the
root entrypoints for the modelprinter npm package; dist/ is never published.
Lockfile generation is disabled in bunfig.toml; do not commit bun.lock or bun.lockb.
Use `bun run snapshot:bolts` to update visual snapshots, then inspect the images
before committing them.
