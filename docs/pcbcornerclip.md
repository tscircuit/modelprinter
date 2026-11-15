# PcbCornerClip

PCB corner support with two perpendicular edge grooves and a central base mounting hole. All dimensions are millimeters after normalization. The complete custom geometry is determined by required dimensions; no supplier series or dimensional standard is inferred.

```text
pcbcornerclip_w16mm_d16mm_h8mm_wall3mm_floor2mm_board1.6mm_lip2mm_slotz3mm_hole3mm
```

| String token | Public property | Example mm |
| --- | --- | --- |
| `w` / `width` | `width` | 16 |
| `d` / `depth` | `depth` | 16 |
| `h` / `height` | `height` | 8 |
| `wall` / `wallthickness` | `wallThickness` | 3 |
| `floor` / `floorthickness` | `floorThickness` | 2 |
| `board` / `boardthickness` | `boardThickness` | 1.6 |
| `lip` / `groovedepth` | `grooveDepth` | 2 |
| `slotz` / `slotbottomz` | `slotBottomZ` | 3 |
| `hole` / `holediameter` | `holeDiameter` | 3 |

The flat base is centered in XY, underside Z=0. Walls occupy the -X and -Y edges. Their inward-facing horizontal board grooves are grooveDepth deep and boardThickness high, starting at slotBottomZ. These meet at the inner corner to accept the two adjacent edges of a horizontal board. The board corner is at X=-width/2+wallThickness-grooveDepth, Y=-depth/2+wallThickness-grooveDepth. A centered vertical hole pierces only the floor; its bore clears both walls. The wall and upper lip remain continuous behind the grooves. All corners are square. This is an explicit custom fit, not a claim about a standard PCB thickness or tolerance.

Every listed dimension is required and positive. Unsupported or duplicate tokens (including aliases), nonfinite numbers, malformed units and incompatible mounting dimensions are rejected. No omitted dimension selects a guessed default. Millimeters, centimeters, meters, inches, mils and feet are accepted. Cosmetic details omitted from this contract are fixed as described above. `getPcbCornerClipDimensions` returns the exact bounding box, Z datum and normalized dimensions. Geometry and snapshots belong in jscad-electronics.
