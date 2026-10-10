# CableTieBase

Screw-mounted cable-tie anchor with two perpendicular rectangular tie tunnels. All dimensions are millimeters after normalization. The complete custom geometry is determined by required dimensions; no supplier series or dimensional standard is inferred.

```text
cabletiebase_w24mm_d24mm_h5mm_slotw4mm_sloth2mm_floor1mm_hole3mm
```

| String token | Public property | Example mm |
| --- | --- | --- |
| `w` / `width` | `width` | 24 |
| `d` / `depth` | `depth` | 24 |
| `h` / `height` | `height` | 5 |
| `slotw` / `slotwidth` | `slotWidth` | 4 |
| `sloth` / `slotheight` | `slotHeight` | 2 |
| `floor` / `floorthickness` | `floorThickness` | 1 |
| `hole` / `holediameter` | `holeDiameter` | 3 |

The rectangular base is centered in XY, underside Z=0. One tie tunnel runs the full X width and the other the full Y depth; each is slotWidth wide and slotHeight high, with its floor at Z=floorThickness. The roof thickness is height-floorThickness-slotHeight. A centered vertical fixing hole passes through floor and roof. The tunnels are open at all four sides and intersect in the middle. All edges are sharp and no adhesive layer or fastener is included.

Every listed dimension is required and positive. Unsupported or duplicate tokens (including aliases), nonfinite numbers, malformed units and incompatible mounting dimensions are rejected. No omitted dimension selects a guessed default. Millimeters, centimeters, meters, inches, mils and feet are accepted. Cosmetic details omitted from this contract are fixed as described above. `getCableTieBaseDimensions` returns the exact bounding box, Z datum and normalized dimensions. Geometry and snapshots belong in jscad-electronics.
