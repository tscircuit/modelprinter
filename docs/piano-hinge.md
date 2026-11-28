# `pianohinge`

Continuous equal-leaf piano hinge with alternating knuckles and two longitudinal fixing-hole rows in the 180-degree open position (roadmap item `0093`).

## Canonical Model String

```text
pianohinge_w30mm_l200mm_t1mm_pin3mm_knucklel10mm_hole3mm_p40mm_rows2_open180deg_holes10_endoffset20mm
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `w<len>` | `openWidth` | `30` | Full open width across both leaves along `X` (mm) |
| `l<len>` | `length` | `200` | Continuous hinge length along `Y` (mm) |
| `t<len>` | `leafThickness` | `1` | Leaf stock thickness (mm) |
| `pin<len>` | `pinDiameter` | `3` | Hinge pin diameter (mm) |
| `knucklel<len>` | `knuckleLength` | `10` | Individual alternating knuckle length (mm) |
| `hole<len>` | `holeDiameter` | `3` | Fixing hole diameter (mm) |
| `p<len>` | `holePitch` | `40` | Longitudinal hole pitch along each leaf row (mm) |
| `rows2` | `rows` | `2` | One fixing hole row per leaf |
| `open180deg` | `openAngle` | `180` | Flat 180-degree open pose |
| `holes<int>` | `holes` | `10` | Even total fixing hole count across both rows |
| `endoffset<len>` | `endOffset` | `20` | Distance from each end to the first/last hole (mm) |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on `(X, Y)` at the rear leaf mounting face (`bottomZ = 0`), rising to `topZ = pinDiameter + 2 * leafThickness`.
- **Validation**: Ensures even hole count, longitudinal hole-pattern fit (`2 * endOffset + (holes / 2 - 1) * holePitch <= length`), and barrel/hole lateral clearance.
