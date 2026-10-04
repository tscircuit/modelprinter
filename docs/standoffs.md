# Hexagonal standoffs

The `femalestandoff` and `malefemalestandoff` model strings implement roadmap
items 0008 and 0009 from issue #13 as one family of parameter contracts.

```ts
import { mp } from "@tscircuit/modelprinter"

mp.string("femalestandoff_m3_w5.5mm_l10mm").json()
// { fn: "femalestandoff", metricSize: "M3", width: 5.5, length: 10 }

mp.string("malefemalestandoff_m3_w5.5mm_l10mm_stud5mm").json()
// { fn: "malefemalestandoff", metricSize: "M3", width: 5.5, length: 10, studLength: 5 }
```

A female standoff has internal threads at both ends. A male-female standoff has
an internal thread at one end and a projecting threaded stud at the other. Both
use a hexagonal body; `width` is measured across opposite flat faces. `length`
measures only the body, so the male-female part's total axial length is
`length + studLength`.

| Property | String tokens | Default |
| --- | --- | --- |
| `metricSize` | `m` | `M3` |
| `width` | `w`, `width` | 5.5 mm |
| `length` | `l`, `length` | 10 mm |
| `studLength` (male-female only) | `stud`, `studlength` | 5 mm |

The shared metric-size vocabulary is `M2`, `M2.5`, `M3`, `M4`, `M5`, `M6`, `M8`,
`M10`, and `M12`. For example, use `m2.5` in a string or `metricSize: "M2.5"` in
schema input. Dimensions accept millimeter numbers or unit-bearing strings and
normalize to millimeters. Names and string tokens are case-insensitive.

Defaults reproduce the roadmap's M3 examples; body dimensions do not automatically
scale with the selected thread. Supply a suitable width for a larger thread,
for example `femalestandoff_m6_w10mm`. All lengths must be finite and positive,
and the across-flats width must exceed the nominal thread diameter. A female
standoff rejects stud properties. Unknown properties/tokens, duplicate aliases,
dimension flags without values, and inline root values are rejected.

The contracts specify nominal visualization dimensions, not manufacturing
tolerances, thread engagement depths, materials, or a particular vendor part.
Geometry and rendering belong in `jscad-electronics`.

Each model exports props and definition schemas, input/output types, and is
registered in `modelDefinitionSchema` and `modelprinter.getModelNames()`:

- `femaleStandoffModelPropsSchema`, `femaleStandoffModelDefinitionSchema`,
  `FemaleStandoffModelPropsInput`, `FemaleStandoffModelProps`,
  `FemaleStandoffModelDefinition`.
- `maleFemaleStandoffModelPropsSchema`, `maleFemaleStandoffModelDefinitionSchema`,
  `MaleFemaleStandoffModelPropsInput`, `MaleFemaleStandoffModelProps`,
  `MaleFemaleStandoffModelDefinition`.
