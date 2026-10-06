# Adding and registering models

A model's parameter contract, parser, public exports, and registration live
together in `src/models/<name>/`. Use a canonical lowercase name, such as
`spacer`, for both the folder and the model's `fn` discriminator.

| File | Responsibility |
| --- | --- |
| `schema.ts` | Zod props and definition schemas, input/output types, defaults, dimensions, and validation. The definition schema uses `fn: z.literal("spacer")`. |
| `parse-model-string.ts` | Parse `RawModelprinterParams`, reject unsupported or duplicate tokens, and return the validated definition from the model's schema. |
| `index.ts` | Export the model's public schemas, types, and helpers. |
| `register.ts` | Export the typed `model` descriptor and a `register(registry)` function. |

For example, after implementing `spacerModelDefinitionSchema` and
`parseSpacerModelParams`, add this `register.ts`:

```ts
import { defineModel, type ModelRegistry } from "../../model-registry"
import { spacerModelDefinitionSchema } from "./schema"
import { parseSpacerModelParams } from "./parse-model-string"

export const model = defineModel({
  name: "spacer",
  schema: spacerModelDefinitionSchema,
  parse: parseSpacerModelParams,
})

export function register(registry: ModelRegistry): void {
  registry.register(model)
}
```

`defineModel` preserves the literal name and the schema's output type. Its
types reject a widened or union name, a schema with a different `fn`, or a
parser returning the wrong definition. Each registry owns its registrations;
duplicate names and names containing anything except lowercase letters are
rejected. A parser runs once, and its result must have the registered `fn`.
Validation, unit conversion, defaults, and transforms belong in that parser,
normally through `spacerModelDefinitionSchema.parse(...)`; the registry does
not parse its result a second time.

Keep the public barrel focused on the model's API:

```ts
// src/models/spacer/index.ts
export * from "./schema"
```

Do not export the generic `model` or `register` names from that barrel. Every
model has its own versions, so exporting them through the package would cause
name collisions. Existing models retain their legacy source entrypoints for
compatibility.

The generator discovers immediate model folders with
`Bun.Glob("*/register.ts")`. It writes ignored `src/generated/models.ts` with
static imports, registration calls, model public re-exports, and a typed
definition-schema union. Adding a model therefore needs no manual edits to
the central parser registry, public export list, or `ModelDefinition` union.
The existing model-name and schema-option orders remain stable; new folders
are added in lexical order. Generation fails if no registrations are found.

The generated file is replaced atomically only when its contents change.
Do not hand-edit or commit `src/generated/`. Bun performs discovery during
development and builds; the published package contains ordinary ESM and
declarations, including `types/generated/models.d.ts`, and works in Node
without a Bun runtime.

| Command | Generation behavior |
| --- | --- |
| `bun run generate` | Generate the registry explicitly. |
| `bun test` or `bun run test` | An awaited test preload generates before tests run. |
| `bun run typecheck` | Generate before checking types. |
| `bun run format` or `bun run format:check` | Generate before formatting or checking formatting. |
| `bun run build` | Generate, bundle the ESM entrypoint, emit declarations, and prepare package entrypoints. |
| `prepare` and `prepack` | Use the build workflow, so installation and packing also refresh registration. |

For continuous development, run `bun run generate:watch` in one terminal and
`bun test --watch` in another. The generator watches the model subtree,
including folder additions and removals, and debounces changes before
regenerating. A one-off command always scans the current folders again, so a
fresh checkout does not depend on a previous watch session.

Add contract tests for the new model's full string, public schema and helpers,
defaults, units, and invalid or conflicting parameters. Keep reusable
assertions in `tests/fixtures` and avoid `describe` blocks. Run `bun test`,
`bun run typecheck`, `bun run format:check`, and `bun run build` before
submitting. Geometry and visual snapshots belong in `tscircuit/jscad-electronics`.
