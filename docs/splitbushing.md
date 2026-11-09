# Split bushing

```text
splitbushing_id20mm_od25mm_l30mm_gap1mm_plainsplit_edgechamfer0.5mm
```

Plain sleeve with one longitudinal slit through its wall. The bore is centered
on the XY origin and the end planes are Z=0 and Z=length. The slit opens toward
+X and removes the strip at `x >= 0`, `abs(y) < gap / 2` through the full
length. Its parallel walls and longitudinal edges stay sharp.

| Property | Tokens | Meaning |
| --- | --- | --- |
| `innerDiameter` | `id`, `innerdiameter` | Nominal bore diameter, required and positive |
| `outerDiameter` | `od`, `outerdiameter` | Nominal outside diameter, required and positive |
| `length` | `l`, `length` | End-to-end axial length, required and positive |
| `gap` | `gap` | Width between slit walls, required and positive |
| `plainSplit` | `plainsplit` | Value-free style flag, defaults to true |
| `edgeChamfer` | `edgechamfer` | Equal 45-degree radial and axial setback at the inner and outer rims of both ends, defaults to zero |

Lengths normalize to millimeters. Complete decimal lengths accept `mm`, `cm`,
`m`, `in`, `inch`, `mil`, `ft` and `feet`, or no unit for millimeters.
Token order and letter case are unrestricted. Unknown tokens, repeated
properties, valued flags and the provisional `style(plainsplit)` selector fail.

The gap must be smaller than the bore diameter so the slit reaches the bore
between two distinct inner lips. The outside diameter must exceed the bore
diameter. For radial wall thickness W and chamfer c, require 2c < W and
2c < length so the remaining end wall and straight bore both have positive
dimensions. The chamfers follow the inner and outer rims through the slit.

`getSplitBushingDimensions` returns normalized props, wall thickness, the
diameters and wall thickness at the ends, straight length and end datums.
The example has 2.5 mm nominal wall thickness, 21 mm end bore, 24 mm end
outside diameter, 1.5 mm end wall and 29 mm straight length. Geometry
generation belongs in `jscad-electronics`.

Roadmap item [0280](https://github.com/tscircuit/modelprinter/issues/13#issuecomment-5977315678).
