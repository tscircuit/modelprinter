# PottingBox

Open rectangular potting cup with two pierced floor-level mounting ears. All dimensions are millimeters after normalization. The complete custom geometry is determined by required dimensions; no supplier series or dimensional standard is inferred.

```text
pottingbox_w60mm_d40mm_h25mm_wall1.5mm_floor1.5mm_earl10mm_earw12mm_hole3mm_hp70mm
```

| String token | Public property | Example mm |
| --- | --- | --- |
| `w` / `width` | `width` | 60 |
| `d` / `depth` | `depth` | 40 |
| `h` / `height` | `height` | 25 |
| `wall` / `wallthickness` | `wallThickness` | 1.5 |
| `floor` / `floorthickness` | `floorThickness` | 1.5 |
| `earl` / `earlength` | `earLength` | 10 |
| `earw` / `earwidth` | `earWidth` | 12 |
| `hole` / `holediameter` | `holeDiameter` | 3 |
| `hp` / `holepitch` | `holePitch` | 70 |

The outer cup is centered in XY, its floor underside at Z=0 and open rim at Z=height. Cavity dimensions are width-2*wallThickness by depth-2*wallThickness by height-floorThickness. Two rectangular ears project earLength beyond the ±X walls, centered on Y=0, with earWidth along Y and floorThickness along Z. Their vertical fixing bores lie at X=±holePitch/2, Y=0. All radii and chamfers are zero. No lid, potting compound, electronics or mounting screws are included.

Every listed dimension is required and positive. Unsupported or duplicate tokens (including aliases), nonfinite numbers, malformed units and incompatible mounting dimensions are rejected. No omitted dimension selects a guessed default. Millimeters, centimeters, meters, inches, mils and feet are accepted. Cosmetic details omitted from this contract are fixed as described above. `getPottingBoxDimensions` returns the exact bounding box, Z datum and normalized dimensions. Geometry and snapshots belong in jscad-electronics.
