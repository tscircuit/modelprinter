# Square tube

`squaretube` describes straight stock with concentric rounded-square outside
and inside profiles. It implements roadmap #13 item 0163. Dimensions are nominal
custom geometry, without a supplier series, material or tolerance specification.
The parser produces model definitions; rendering belongs in jscad-electronics.

```ts
import { getSquareTubeDimensions, mp } from "@tscircuit/modelprinter"

mp.string("squaretube_w25mm_wall2mm_l200mm_outerr4mm_innerr2mm").json()
getSquareTubeDimensions({ width: 25, wallThickness: 2, length: 200, outerRadius: 4, innerRadius: 2 })
```

| Property | Tokens | Default | Meaning |
| --- | --- | --- | --- |
| `width` | `w`, `width` | Required | Outside width and height |
| `wallThickness` | `wall`, `wallthickness` | Required | Thickness between corresponding flat faces |
| `length` | `l`, `length` | Required | Axial length between square-cut ends |
| `outerRadius` | `outerr`, `outerradius` | 0 | Outside quarter-circle corner radius |
| `innerRadius` | `innerr`, `innerradius` | 0 | Inside quarter-circle corner radius |

Lengths accept finite numbers in millimeters or complete numeric strings with
`mm`, `cm`, `m`, `in`, `inch`, `mil`, `ft` or `feet` units. Outputs use millimeters.
String tokens and units are case-insensitive; property names use the casing above.
Unknown properties, incomplete lengths, repeated tokens and aliases are rejected.

The extrusion runs along +Z from 0 to `length`, with open ends and no chamfers.
Both cross-sections are centered at X=Y=0, with sides parallel to the X and Y axes.
Outside bounds are ±`width/2`; inside bounds are ±`innerWidth/2`, where
`innerWidth = width - 2 * wallThickness`. Each corner is a tangent quarter circle.
Radii cannot exceed half their respective profile width.

The radii are independent: `wallThickness` measures the flat walls, not necessarily
the corners. Validation requires the complete inner profile to stay strictly
inside the outer profile. The minimum wall is the lesser of `wallThickness` and
`sqrt(2) * wallThickness - (sqrt(2) - 1) * (outerRadius - innerRadius)`.
This is the minimum separation of supporting lines, attained on an axis or at
45 degrees. It catches corner breakout even when the flat walls are positive.

`getSquareTubeDimensions` returns the normalized props plus `innerWidth`,
`minimumWallThickness` and `crossSectionArea` in square millimeters. Area is the
outer rounded-square area minus the inner rounded-square area. The public props,
definition schema and generated `modelDefinitionSchema` union share validation.
