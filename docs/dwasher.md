# D-shaped washer

```text
dwasher_id6.4mm_od18mm_h2mm_flatdepth4mm
```

A flat washer with a centered round bore and one straight cut on the outside.
The bore and nominal outside circle are centered on XY. The cut removes the
cap on the +X side. The faces are at Z=0 and Z=thickness.

| Property | Tokens | Meaning |
| --- | --- | --- |
| `innerDiameter` | `id`, `innerdiameter` | Diameter of the centered bore |
| `outerDiameter` | `od`, `outerdiameter` | Diameter before the outside cut |
| `thickness` | `h`, `t`, `thickness` | Distance between the end faces |
| `flatDepth` | `flatdepth` | Positive distance inward from the outside tangent to the flat |

The bore and D outline are fixed by the model name. The cut must stop outside
the bore so that a positive wall remains. The example puts the flat at X=5 mm,
leaves 1.8 mm of wall there, and gives an outside width of 14 mm along X.

Lengths normalize to millimeters. Bare numbers mean millimeters. Complete
decimal lengths accept mm, cm, m, in, inch, mil, ft and feet. Token order and
case are unrestricted. Unknown and repeated tokens fail.

`getDWasherDimensions` returns the normalized props, X location of the flat,
chord length, wall at the flat, size, bounds and end datums. Roadmap item
[0628](https://github.com/tscircuit/modelprinter/issues/13#issuecomment-5977316769).
