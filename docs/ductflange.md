# Duct flange

`ductflange_id150mm_od200mm_t2mm_holes8_hole6.6mm_pcd180mm_clock0deg`

A circular mounting ring centered on XY from Z=0 to Z=`thickness`. The
round bolt holes are evenly spaced on a circle. The first hole is rotated
by `clockAngle` counterclockwise from +X about +Z.

| Property | Token | Meaning |
| --- | --- | --- |
| `innerDiameter` | `id` | Center opening diameter |
| `outerDiameter` | `od` | Outside diameter |
| `thickness` | `t` | Axial thickness |
| `holeCount` | `holes` | Number of bolt holes |
| `holeDiameter` | `hole` | Diameter of each bolt hole |
| `pitchCircleDiameter` | `pcd` | Diameter of the circle through the hole centers |
| `clockAngle` | `clock` | First hole angle in degrees, defaults to 0 |

Lengths normalize to millimeters. Short tokens and full property names
are case insensitive. Each property can appear only once. The count must
be a positive safe integer, and the clock angle is in the range
`0 <= clockAngle < 360`. The holes must retain material at both ring edges
and between adjacent holes, allowing for numerical rounding at the ring's
scale. `getDuctFlangeDimensions` reports the radii, both webs, angular pitch
and envelope.

[Roadmap item 0642](https://github.com/tscircuit/modelprinter/issues/13#issuecomment-5977316769)
