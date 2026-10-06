# Plain bushing

`plainbushing` defines a closed cylindrical sleeve bearing with a through bore.
It produces validated dimensions and model definitions for mechanical layout;
geometry belongs in jscad-electronics. This is a nominal custom sleeve without
rolling elements, a slit, a flange, fits, or manufacturing tolerances.

```ts
import { getPlainBushingDimensions, mp, plainBushingModelPropsSchema } from "@tscircuit/modelprinter"

mp.string("plainbushing_id8mm_od12mm_l20mm_style(plainclosed)_edgechamfer0.5mm").json()
plainBushingModelPropsSchema.parse({ innerDiameter: "8mm", outerDiameter: "12mm", length: "2cm" })
getPlainBushingDimensions({ innerDiameter: 8, outerDiameter: 12, length: 20, edgeChamfer: 0.5 })
```

| Property | Default | Tokens | Meaning |
| --- | --- | --- | --- |
| `innerDiameter` | Required | `id`, `innerdiameter` | Positive through-bore diameter |
| `outerDiameter` | Required | `od`, `outerdiameter` | Outside sleeve diameter, greater than the bore |
| `length` | Required | `l`, `length` | Overall end-plane distance, including chamfers |
| `style` | `"plainclosed"` | `style(plainclosed)` | Continuous plain sleeve; other styles are rejected |
| `edgeChamfer` | 0 mm | `edgechamfer` | Equal axial/radial setbacks of all four 45-degree inner/outer rim chamfers |

Lengths accept finite numbers in millimeters or complete numeric strings with
optional `mm`, `cm`, `m`, `in`, `inch`, `mil`, `ft`, or `feet` units. Outputs
use millimeters. Token names and style values are case-insensitive; direct props
use the casing shown above. Style tokens require parentheses. Unknown properties,
duplicate tokens/aliases, empty tokens, and malformed lengths are rejected.

The bore and sleeve are concentric with the Z axis. The first annular end face
is at Z=0 and the second is at Z=`length`. The bore opens through both end faces.
Chamfers stay inside this extent, enlarge the bore openings and reduce the
outside end diameters. There is no preferred angular phase about Z.

`getPlainBushingDimensions` returns the normalized `innerDiameter`,
`outerDiameter`, `length`, and:

| Dimension | Formula |
| --- | --- |
| `wallThickness` | `(outerDiameter - innerDiameter) / 2` |
| `endInnerDiameter` | `innerDiameter + 2 * edgeChamfer` |
| `endOuterDiameter` | `outerDiameter - 2 * edgeChamfer` |
| `straightLength` | `length - 2 * edgeChamfer` |

Chamfer is nonnegative and strictly less than half the wall thickness and half
the length. These checks preserve annular end faces and a positive straight
section of bore and outside wall. Diameters and length are required and positive.

The strict exported props/definition schemas share these checks.
`PlainBushingModelPropsInput` accepts unit strings and optional defaults;
`PlainBushingModelProps` contains normalized lengths and resolved defaults.
`PlainBushingModelDefinition` adds `fn: "plainbushing"` and is included in the
public `modelDefinitionSchema` union.
