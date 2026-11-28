# Finned heatsink

```text
finnedheatsink_w40mm_l50mm_base3mm_h20mm_fins8_fint1mm_p5mm_holes2_hole3mm_hp40mm_longitudinal
```

This custom flat-base extruded heatsink carries straight parallel rectangular
fins and two centered through-base fixing holes along the central inter-fin
channel. No supplier extrusion profile is implied.

| Token | JSON property | Default |
| --- | --- | --- |
| `w`, `width` | `width` | 40 mm |
| `l`, `length` | `length` | 50 mm |
| `base`, `basethickness` | `baseThickness` | 3 mm |
| `h`, `height` | `height` | 20 mm |
| `fins`, `fincount` | `finCount` | 8 |
| `fint`, `finthickness` | `finThickness` | 1 mm |
| `p`, `pitch`, `finpitch` | `finPitch` | 5 mm |
| `holes`, `holecount` | `holeCount` | 2 |
| `hole`, `holed`, `holediameter` | `holeDiameter` | 3 mm |
| `hp`, `holepitch` | `holePitch` | 40 mm |
| `longitudinal` / `transverse` | `longitudinal` | `true` |

The local mounting datum is the center of the flat lower contact face at
`(X,Y,Z)=(0,0,0)`. The base spans `±width/2` along `X`, `±length/2` along `Y`,
and from `Z=0` to `+baseThickness`, with straight fins rising to `Z=height`.

Value-free `longitudinal` (`longitudinal: true`, fins running along `Y` and
spaced across `X`) and `transverse` (`longitudinal: false`, fins running along
`X` and spaced across `Y`) select the fin axis; legacy `axis(...)` selectors are
rejected. Two centered through-base fixing holes of diameter `holeDiameter` sit
at `(0, ±holePitch/2, 0)` when `longitudinal` is `true` (or `(±holePitch/2, 0, 0)`
when `false`) and cut through `baseThickness`. `getFinnedHeatsinkDimensions` and
`getFinnedHeatsinkMountingHoles` resolve fin centers, channel widths, margins,
and mounting bores.

Validation requires `baseThickness < height`, `finPitch > finThickness`, an even
`finCount` whose central channel `finPitch - finThickness` exceeds
`holeDiameter`, `(finCount - 1) * finPitch + finThickness` within the cross-fin
span, and `holePitch + holeDiameter` within the fin run span. Geometry
generation belongs in `jscad-electronics`.
