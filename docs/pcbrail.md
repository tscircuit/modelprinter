# PcbRail

L-section PCB edge rail with a horizontal board groove and pierced mounting tabs at both ends. All dimensions are millimeters after normalization. The complete custom geometry is determined by required dimensions; no supplier series or dimensional standard is inferred.

```text
pcbrail_l80mm_w12mm_h8mm_wall3mm_floor2mm_slotw1.8mm_slotd2mm_slotz4mm_tabl8mm_tabw8mm_hole3mm_hp88mm
```

| String token | Public property | Example mm |
| --- | --- | --- |
| `l` / `length` | `length` | 80 |
| `w` / `width` | `width` | 12 |
| `h` / `height` | `height` | 8 |
| `wall` / `wallthickness` | `wallThickness` | 3 |
| `floor` / `floorthickness` | `floorThickness` | 2 |
| `slotw` / `slotwidth` | `slotWidth` | 1.8 |
| `slotd` / `slotdepth` | `slotDepth` | 2 |
| `slotz` / `slotbottomz` | `slotBottomZ` | 4 |
| `tabl` / `tablength` | `tabLength` | 8 |
| `tabw` / `tabwidth` | `tabWidth` | 8 |
| `hole` / `holediameter` | `holeDiameter` | 3 |
| `hp` / `holepitch` | `holePitch` | 88 |

The rail length is along X, centered at the origin; width is Y and underside is Z=0. The vertical wall lies along the -Y edge. A horizontal groove runs through the entire length, opens toward +Y, extends slotDepth into the wall, and occupies Z=slotBottomZ..slotBottomZ+slotWidth. The flat floor supports a horizontal board extending toward +Y. Two tabs extend tabLength beyond the body ends at ±X; each has tabWidth along Y and floorThickness along Z. Their vertical bores are centered at X=±holePitch/2, Y=0. Hole pitch measures the mounting centers, not the body length. No board or mounting screws are included.

Every listed dimension is required and positive. Unsupported or duplicate tokens (including aliases), nonfinite numbers, malformed units and incompatible mounting dimensions are rejected. No omitted dimension selects a guessed default. Millimeters, centimeters, meters, inches, mils and feet are accepted. Cosmetic details omitted from this contract are fixed as described above. `getPcbRailDimensions` returns the exact bounding box, Z datum and normalized dimensions. Geometry and snapshots belong in jscad-electronics.
