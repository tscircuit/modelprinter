# CableClamp

P-shaped cable strap with a closed circular passage and two overlapping pierced mounting tabs. All dimensions are millimeters after normalization. The complete custom geometry is determined by required dimensions; no supplier series or dimensional standard is inferred.

```text
cableclamp_id10mm_bandw12mm_t1mm_tab12mm_hole4mm
```

| String token | Public property | Example mm |
| --- | --- | --- |
| `id` / `innerdiameter` | `innerDiameter` | 10 |
| `bandw` / `bandwidth` | `bandWidth` | 12 |
| `t` / `thickness` | `thickness` | 1 |
| `tab` / `tablength` | `tabLength` | 12 |
| `hole` / `holediameter` | `holeDiameter` | 4 |

The loop axis is Y and its center is X=0, Z=innerDiameter/2+2*thickness. The passage remains a complete circle. The two tab layers occupy Z=0..2*thickness and extend toward -X, ending at X=0 beneath the loop. tabLength measures the extension beyond the loop outer radius; the vertical hole is centered on that extension. The loop outer bottom is Z=thickness and the mounting underside is Z=0. The overlapping layers are a single connected nominal solid; their cosmetic seam is omitted. No material, clamp force or cable rating is implied.

Every listed dimension is required and positive. Unsupported or duplicate tokens (including aliases), nonfinite numbers, malformed units and incompatible mounting dimensions are rejected. No omitted dimension selects a guessed default. Millimeters, centimeters, meters, inches, mils and feet are accepted. Cosmetic details omitted from this contract are fixed as described above. `getCableClampDimensions` returns the exact bounding box, Z datum and normalized dimensions. Geometry and snapshots belong in jscad-electronics.
