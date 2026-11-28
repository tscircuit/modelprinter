# Double-Row Ball Bearing (`doubleballbearing`)

Open double-row radial ball bearing (4204 style) with two parallel ball tracks in shared inner and outer rings.

## Example Model String

```text
doubleballbearing_id20mm_od47mm_w20mm_rows2_contactangle0deg_open
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `id<length>` | `innerDiameter` | `20 mm` | Bore diameter |
| `od<length>` | `outerDiameter` | `47 mm` | Outer ring diameter |
| `w<length>` | `width` | `20 mm` | Overall bearing width |
| `rows2` | `rows` | `2` | Double-row layout |
| `contactangle<deg>` | `contactAngle` | `0 deg` | Contact angle (`0..45 deg`) |
| `open` | `open` | `true` | Value-free unsealed open closure flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Bore axis on lower ring face (`bottomZ = 0`, `topZ = width`).
