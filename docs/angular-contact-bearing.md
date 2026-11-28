# Angular-Contact Bearing (`angularcontactbearing`)

Open single-row angular-contact ball bearing (7202B style) with asymmetric raceway shoulders for combined radial and axial thrust loads.

## Example Model String

```text
angularcontactbearing_id15mm_od35mm_w11mm_contactangle40deg_rows1_open
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `id<length>` | `innerDiameter` | `15 mm` | Bore diameter |
| `od<length>` | `outerDiameter` | `35 mm` | Outer ring diameter |
| `w<length>` | `width` | `11 mm` | Bearing width |
| `contactangle<deg>` | `contactAngle` | `40 deg` | Nominal ball contact angle (`12..45 deg`) |
| `rows1` | `rows` | `1` | Single-row layout |
| `open` | `open` | `true` | Value-free unsealed open closure flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Bore axis on the thrust-taking back face (`bottomZ = 0`, `topZ = width`).
