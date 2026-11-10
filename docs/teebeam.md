# Tee beam

`teebeam_h40mm_w40mm_web4mm_flange4mm_rootr2mm_l200mm`

T-section stock with a centered upright web on a flat flange. The flange
spans Y=0 to Y=`flangeThickness`, the top of the web is at Y=`height`, and the
section is centered on X. The length runs from Z=0 to Z=`length`. Two equal
root radii join the flange to the web.

| Property | Token | Meaning |
| --- | --- | --- |
| `height` | `h` | Total section height |
| `width` | `w` | Flange width |
| `webThickness` | `web` | Width of the upright web |
| `flangeThickness` | `flange` | Height of the flange |
| `rootRadius` | `rootr` | Radius at each inside corner, defaults to 0 |
| `length` | `l` | Overall axial length |

Lengths normalize to millimeters. Short tokens and full property names
are case insensitive. Each property can appear only once. A positive
root radius must leave flat flange and web faces, with distinct tangent
positions. `getTeeBeamDimensions` returns the envelope, the flange overhang
and remaining flat spans on each side.

[Roadmap item 0272](https://github.com/tscircuit/modelprinter/issues/13#issuecomment-5977315678)
