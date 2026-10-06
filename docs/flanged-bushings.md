# Flanged bushing

`flangedbushing` defines a plain closed sleeve with an integral annular flange
and a through bore. It produces validated model definitions and dimensions for
mechanical layout; geometry belongs in jscad-electronics. All dimensions are
nominal custom values without fits, rolling elements, slits, or manufacturing
tolerances. Edges are square, with no implicit chamfers or shoulder fillets.

```ts
import { flangedBushingModelPropsSchema, getFlangedBushingDimensions, mp } from "@tscircuit/modelprinter"

mp.string("flangedbushing_id8mm_od12mm_flangeod18mm_l15mm_flangethickness2mm_style(plainclosed)").json()
flangedBushingModelPropsSchema.parse({ innerDiameter: 8, outerDiameter: 12, flangeDiameter: 18, length: 15, flangeThickness: "2mm" })
getFlangedBushingDimensions({ innerDiameter: 8, outerDiameter: 12, flangeDiameter: 18, length: 15, flangeThickness: 2 })
```

| Property | Default | Tokens | Meaning |
| --- | --- | --- | --- |
| `innerDiameter` | Required | `id`, `innerdiameter` | Positive through-bore diameter |
| `outerDiameter` | Required | `od`, `outerdiameter` | Sleeve outside diameter, greater than the bore |
| `flangeDiameter` | Required | `flangeod`, `flangediameter` | Flange outside diameter, greater than the sleeve |
| `length` | Required | `l`, `length` | Overall length **including the flange** |
| `flangeThickness` | Required | `flangethickness` | Flange axial thickness; less than overall length |
| `style` | `"plainclosed"` | `style(plainclosed)` | Continuous plain sleeve; other styles are rejected |

Lengths accept finite numbers in millimeters or complete numeric strings with
optional `mm`, `cm`, `m`, `in`, `inch`, `mil`, `ft`, or `feet` units. Outputs
use millimeters. Token names and style values are case-insensitive; direct props
use the casing shown above. Style tokens require parentheses. Unknown properties,
malformed lengths, duplicate tokens/aliases, and empty tokens are rejected.

The bore, sleeve and flange are concentric with the Z axis. The outer flange
end face is at Z=0. The flange occupies Z=0 to Z=`flangeThickness`, and its
sleeve-side shoulder is at Z=`flangeThickness`. The sleeve projects from that
shoulder to Z=`length`, so the example has a 13 mm projection and a 15 mm overall
length. The constant-diameter bore opens through the entire flange and sleeve.
There is no preferred angular phase about Z.

`getFlangedBushingDimensions` returns the normalized `innerDiameter`,
`outerDiameter`, `flangeDiameter`, `length`, `flangeThickness`, and:

| Dimension | Formula |
| --- | --- |
| `sleeveLength` | `length - flangeThickness` |
| `wallThickness` | `(outerDiameter - innerDiameter) / 2` |
| `flangeProjection` | `(flangeDiameter - outerDiameter) / 2`, radial overhang |
| `shoulderZ` | `flangeThickness` |

All required dimensions are positive. Diameter ordering must be
`innerDiameter < outerDiameter < flangeDiameter`; flange thickness must be less
than overall length. These constraints retain a closed sleeve wall, a flange
with radial overhang and a positive sleeve projection.

The strict exported props/definition schemas share these checks.
`FlangedBushingModelPropsInput` accepts unit strings and optional default style;
`FlangedBushingModelProps` contains normalized lengths and the resolved style.
`FlangedBushingModelDefinition` adds `fn: "flangedbushing"` and is included in
the public `modelDefinitionSchema` union.
