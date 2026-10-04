# Tubular spacers

`spacer` describes a straight, unthreaded tubular spacer with a circular through
bore. It implements roadmap item 0007 in issue #13. The parameter contract is
renderer-independent; geometry belongs in `jscad-electronics`.

```ts
import { mp, spacerModelPropsSchema } from "@tscircuit/modelprinter"

mp.string("spacer_id3.2mm_od6mm_l10mm").json()
// { fn: "spacer", innerDiameter: 3.2, outerDiameter: 6, length: 10 }

spacerModelPropsSchema.parse({ innerDiameter: "0.125in", outerDiameter: "0.25in" })
// { innerDiameter: 3.175, outerDiameter: 6.35, length: 10 }
```

| Property | String tokens | Default (mm) |
| --- | --- | --- |
| `innerDiameter` | `id`, `innerdiameter` | 3.2 |
| `outerDiameter` | `od`, `outerdiameter` | 6 |
| `length` | `l`, `length` | 10 |

Dimensions accept millimeter numbers or unit-bearing strings and normalize to
millimeters. The defaults match the roadmap example; they are illustrative
dimensions, not a fit, tolerance, material, or manufacturing specification.
`length` is the distance between the two flat end faces.

All dimensions must be finite and greater than zero, and `innerDiameter` must be
strictly less than `outerDiameter`. Unknown properties/tokens, bare dimension
flags, repeated properties (including aliases), and inline values such as
`spacer3` are rejected. Model names and string token names are case-insensitive.

Public exports include `spacerModelPropsSchema`, `spacerModelDefinitionSchema`,
`SpacerModelPropsInput`, `SpacerModelProps`, and `SpacerModelDefinition`. The model
is included in `modelDefinitionSchema` and `modelprinter.getModelNames()`.
