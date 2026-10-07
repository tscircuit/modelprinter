# Generic linear rail

```text
linearrail_w12mm_h8mm_l100mm_baseh2mm_neckw8mm_neckh2mm_chamfer0.5mm_holes4_hole3.5mm_pitch25mm_offset12.5mm_cbore6mm_cbored3mm
```

This is an explicitly dimensioned waisted rail with a 12 × 8 mm example cross-section. These chosen miniature-scale dimensions are illustrative geometry, not a manufacturer profile or a universal size standard. No balls, load rating, raceway tolerance or interchangeable supplier family is implied.

X is transverse and centered on the rail. Y is the travel direction, from 0 to `length`. The underside Z=0 is the mounting-bed datum. The base is `width` wide from Z=0 to `baseHeight`; the neck is `neckWidth` wide up to `baseHeight + neckHeight`; the head returns to `width` up to `height`. The two top outside corners have equal 45-degree `chamfer` cuts; other edges are sharp.

| Token (long alias) | Property | Default |
| --- | --- | --- |
| w (width), h (height), l (length) | width, height, length | 12, 8, 100 mm |
| baseh (baseheight) | baseHeight | 2 mm |
| neckw (neckwidth), neckh (neckheight) | neckWidth, neckHeight | 8, 2 mm |
| chamfer | chamfer | 0.5 mm |
| holes (holecount) | holeCount | 4 |
| hole (holediameter) | holeDiameter | 3.5 mm |
| pitch (holepitch), offset (firstholeoffset) | holePitch, firstHoleOffset | 25, 12.5 mm |
| cbore (counterborediameter), cbored (counterboredepth) | counterboreDiameter, counterboreDepth | 6, 3 mm |

Exactly `holeCount` holes lie at X=0 and Y=`firstHoleOffset + i * holePitch`. They enter from Z=`height` toward -Z through the entire rail. A coaxial flat-bottom counterbore enters from the same face. The example centers are 12.5, 37.5, 62.5 and 87.5 mm, leaving 12.5 mm at each end. Length does not silently crop or add holes: an explicit pattern that reaches an end is rejected. Changing length can change the independently derived final end margin. Counterbores must stop above the neck shoulder; both counterbore values must be zero to disable them. Neighboring cuts, neck walls and end ligaments must remain positive.

`getLinearRailDimensions` returns shoulder heights, the last center and final end margin. `getLinearRailMountingHoles` returns mounting-face centers, directions, through depths and counterbore dimensions. A matching generic `linearcarriage` must carry the same rail width, height, base height, neck width and neck height; matching width alone is insufficient. Translate a carriage along Y without changing the shared rail-bed Z datum.

All lengths accept finite numbers or complete strings in mm, cm, m, in, inch, mil, ft or feet. Hole count is an integer from 1 to 512. Unknown keys/tokens, aliases repeated for the same property, malformed numeric suffixes and incompatible patterns fail. Modelprinter owns this contract; geometry belongs in jscad-electronics.
