# Ball transfer unit

`balltransferunit` describes a custom circular cup with a captive upward-facing
load ball and a top flange with three through mounting holes. It does not select
a supplier series or claim a load capacity. The recirculating support balls and
seals inside the closed cup are omitted from the nominal visualization.

```ts
import { mp, getBallTransferUnitDimensions } from "@tscircuit/modelprinter"

const definition = mp
  .string("balltransferunit_balld25mm_flangeod45mm_h30mm_face3hole_pcd36mm_holed4mm")
  .json()
const dimensions = getBallTransferUnitDimensions()
```

The roadmap spelling `_mount(face3hole)` is accepted as an alias for `_face3hole`.
Both produce `faceThreeHole: true`; repeated or mixed selectors are rejected.
Only this circular three-hole construction is supported.

| Property | Tokens | Default (mm) |
| --- | --- | --- |
| `ballDiameter` | `balld`, `balldiameter` | 25 |
| `bodyDiameter` | `bodyod`, `bodydiameter` | 31 |
| `height` | `h`, `height` | 30 |
| `ballProtrusion` | `ballprotrusion` | 7.5 |
| `flangeDiameter` | `flangeod`, `flangediameter` | 45 |
| `flangeThickness` | `flangethickness` | 3 |
| `pitchCircleDiameter` | `pcd`, `pitchcirclediameter` | 36 |
| `holeDiameter` | `holed`, `holediameter` | 4 |
| `socketClearance` | `socketclearance` | 0.25 |

Lengths accept numbers in millimeters or complete strings with `mm`, `cm`, `m`,
`in`, `inch`, `mil`, `ft`, or `feet`, case insensitive. `height` includes the
exposed ball cap; it is not the cup height. Every omitted feature uses the fixed
default above, independent of other overrides. All exterior edges are square;
there are no chamfers, counterbores, slots, or hidden mounting features.

The unit is centered in XY with its flat cup bottom at Z=0 and its ball top at
Z=`height`. The cup top is at `height - ballProtrusion`. The flange extends
downward from that plane by `flangeThickness`; its underside is the mounting
plane returned as `flangeBottomZ`. Three holes run parallel to Z through just the
flange, at 0°, 120°, and 240° counterclockwise from +X on the pitch circle.

The ball center is Z=`height - ballDiameter / 2`. A nominal spherical socket
has radius `ballDiameter / 2 + socketClearance`; its intersection with the cup
top defines the retaining opening. Validation requires positive lengths, a
nonnegative clearance, a positive housing wall and floor, a projecting cup below
the flange, and an opening smaller than the ball diameter. The cap must be less
than a hemisphere. Mounting holes must stay inside the flange, clear the cup,
and remain separate. Unknown or duplicate properties and unsupported mounts
throw. `ballTransferUnitModelPropsSchema` and
`ballTransferUnitModelDefinitionSchema` validate direct inputs with the same
rules; `getBallTransferUnitDimensions` returns the normalized dimensions and
hole coordinates. Geometry belongs in `jscad-electronics`.
