# T-slot inside corner

```text
tslotinsidecorner_w20mm_leg40mm_t4mm_angle90deg_holes2_hole5mm_offset20mm_bendr1mm
```

This custom narrow equal-leg bracket has one centered round through-hole on
each leg. It is a fixed 90-degree formed angle, with no supplier series implied.
`angle` is an explicit compatibility assertion: angles other than 90 degrees
and counts other than two holes are rejected because they require other layouts.

| Token | JSON property | Default |
| --- | --- | --- |
| `w`, `width` | `width` | 20 mm |
| `leg`, `leglength` | `legLength` | 40 mm |
| `t`, `thickness` | `thickness` | 4 mm |
| `angle` | `angle` | 90 degrees |
| `holes`, `holecount` | `holeCount` | 2 total |
| `hole`, `holediameter` | `holeDiameter` | 5 mm |
| `offset`, `holeoffset` | `holeOffset` | 20 mm |
| `bendr`, `bendradius` | `bendRadius` | 0 mm |

The local mounting datum is the virtual intersection of the two inside flat
faces, at X=Z=0 and the middle of the width at Y=0. Y spans ±width/2. The base
extends in +X to `legLength`, with inside face Z=0 and material toward -Z by
`thickness`. The upright extends in +Z to `legLength`, with inside face X=0 and
material toward -X by `thickness`. Leg lengths include the distance occupied
by the bend; they are not straight lengths measured from the bend tangent.

The inside bend is a quarter-circle of radius `bendRadius`, centered at
(X,Z)=(bendRadius,bendRadius), tangent to each inside flat at that same distance
from the datum. The matching outside bend is concentric with radius
`bendRadius + thickness`. Radius zero gives a sharp inside corner. Width edges
and both free leg ends are square, with zero radii/chamfers. There are no ribs,
slots, countersinks, threads or captive fasteners.

The base hole starts at (holeOffset,0,0) and cuts toward -Z; the upright hole
starts at (0,0,holeOffset) and cuts toward -X. Each cuts through the full
`thickness`. Both use `holeDiameter`. `getTSlotInsideCornerMountingHoles` returns
these mounting-face centers, directions, diameters and through-cut depths.
Holes must remain strictly inside the straight legs and width edges, clear of
the bend tangents and free ends. The thickness must be smaller than the leg.

Lengths normalize to mm from finite numbers or complete strings with optional
`mm`, `cm`, `m`, `in`, `inch`, `mil`, `ft` or `feet`. Angles accept numeric degrees
with optional `deg`; counts are unitless integers. Direct props/definition
schemas are strict. Unknown tokens, duplicate parameters (including aliases),
malformed values and incompatible mounting layouts fail. Geometry generation
belongs in jscad-electronics.
