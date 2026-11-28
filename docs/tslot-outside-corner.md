# T-slot outside corner

```text
tslotoutsidecorner_w40mm_leg40mm_t4mm_angle90deg_holes4_hole5mm_hp20mm_bendr4mm
```

This custom wide equal-leg 90-degree outside angle bracket has two transverse
through-holes on each leg and a rounded outer bend. No supplier series is
implied. `angle` (`90` degrees) and `holeCount` (`4` total, two per leg) are
explicit compatibility assertions.

| Token | JSON property | Default |
| --- | --- | --- |
| `w`, `width` | `width` | 40 mm |
| `leg`, `leglength` | `legLength` | 40 mm |
| `t`, `thickness` | `thickness` | 4 mm |
| `angle` | `angle` | 90 degrees |
| `holes`, `holecount` | `holeCount` | 4 total |
| `hole`, `holediameter` | `holeDiameter` | 5 mm |
| `hp`, `holepitch` | `holePitch` | 20 mm |
| `offset`, `holeoffset` | `holeOffset` | 20 mm |
| `bendr`, `bendradius` | `bendRadius` | 4 mm |

The local coordinate datum is the virtual intersection of the two outside flat
faces at `X=Z=0`, centered across the bracket width at `Y=0` (`Y` spans
`±width/2`). The base leg extends in `+X` to `legLength` with outer face `Z=0`
and inner mounting face `Z=thickness`. The upright leg extends in `+Z` to
`legLength` with outer face `X=0` and inner mounting face `X=thickness`.

The outer bend is a quarter-circle of radius `bendRadius` centered at
`(X,Z)=(bendRadius,bendRadius)`. The inner corner radius is
`max(0, bendRadius - thickness)`, producing a sharp inner corner at
`(thickness,thickness)` when `bendRadius <= thickness` and a concentric inner
arc when `bendRadius > thickness`.

On each leg, two through-holes of diameter `holeDiameter` sit at transverse
coordinates `Y = ±holePitch/2` and along-leg coordinate `holeOffset`, starting
on the inner mounting face and cutting outward through `thickness`.
`getTSlotOutsideCornerMountingHoles` and `getTSlotOutsideCornerDimensions`
return these resolved mounting holes, bend radii, and envelope dimensions.
Geometry generation belongs in `jscad-electronics`.
