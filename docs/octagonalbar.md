# Octagonal bar

```text
octagonalbar_af20mm_l100mm_regular_cornerr0mm
```

Solid regular octagonal stock with eight longitudinal flat faces and flat
ends. The cross section is centered on the XY origin. Four of its flat faces
are parallel to the X or Y axis. The length runs from Z=0 to Z=length.

| Property | Tokens | Meaning |
| --- | --- | --- |
| `acrossFlats` | `af`, `acrossflats` | Distance between opposite flat faces, required and positive |
| `length` | `l`, `length` | Axial length, required and positive |
| `regular` | `regular` | Value-free shape flag, defaults to true |
| `cornerRadius` | `cornerr`, `cornerradius` | Equal longitudinal corner fillet radius, defaults to zero |

Lengths normalize to millimeters. Complete decimal lengths accept `mm`, `cm`,
`m`, `in`, `inch`, `mil`, `ft` and `feet`, or no unit for millimeters.
Token order and letter case are unrestricted. Unknown tokens, repeated
properties, valued flags and the provisional `shape(regular)` selector fail.

For across-flats size A, the apothem is A/2. A radius r must satisfy
0 <= r < A/2 so that each flat retains length `(A - 2r) * tan(pi/8)`.
Rounding preserves the axial length and the A by A axis-aligned envelope.
The maximum distance from the axis is `r + (A/2 - r) / cos(pi/8)`.

`getOctagonalBarDimensions` returns normalized props, the apothem, remaining
flat length, actual circumradius, size, bounds and end datums. Geometry
generation belongs in `jscad-electronics`.

Roadmap item [0945](https://github.com/tscircuit/modelprinter/issues/13#issuecomment-5977317182).
