# Repository conventions

- Do not update README.md when adding new models.
- Render all visual snapshots with poppygl.
- Test files must never use describe blocks and must contain exactly one visual test per file.
- Keep reusable assertions and rendering helpers in tests/fixtures. Each visual test should compare its rendered PNG against a committed snapshot.

Run `bun test`, `bun run typecheck`, `bun run format:check`, and `bun run build`
before submitting changes. Commit regenerated dist files. Use `bun run snapshot:bolts` to
update visual snapshots, then inspect the images before committing them.
