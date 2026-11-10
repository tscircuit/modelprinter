# Perforated tube

`perforatedtube_od25mm_wall2mm_l100mm_hole3mm_axialpitch10mm_rows9_end10mm_around8_stagger0deg`

A round tube centered in XY with ends at Z=0 and Z=`length`. Round holes
point radially through their near wall into the bore. In each row the holes
are evenly spaced around the tube. The first row is centered at `endOffset`.
Successive row centers are separated by `axialPitch`. Row 0 starts on the
positive X axis. Odd-indexed rows rotate by `staggerAngle` around positive Z.

| Property | Token | Meaning |
| --- | --- | --- |
| `outerDiameter` | `od` | Outside diameter |
| `wallThickness` | `wall` | Radial wall thickness |
| `length` | `l` | Overall length |
| `holeDiameter` | `hole` | Round hole diameter |
| `axialPitch` | `axialpitch` | Center spacing between rows |
| `rowCount` | `rows` | Number of rows |
| `endOffset` | `end` | Distance from the first end to row 0 |
| `holesAround` | `around` | Number of holes per row |
| `staggerAngle` | `stagger` | Alternating row rotation in degrees, defaults to 0 |

Lengths normalize to millimeters. The row and hole counts are positive safe
integers, and the stagger is in the range `0 <= staggerAngle < 360 / holesAround`.
Short tokens and full property names are case insensitive. Each property can
appear only once. The tube must retain a bore, positive end margins and
separation between holes at the inner wall. `getPerforatedTubeDimensions`
reports the bore diameter, row limits, end margins, angle pitch, hole count
and envelope.

Spacing checks leave room for rounding when computing row coordinates and
angles. Very closely spaced centers can be rejected when their separation
cannot be guaranteed at the model's scale.

[Roadmap item 0161](https://github.com/tscircuit/modelprinter/issues/13)
