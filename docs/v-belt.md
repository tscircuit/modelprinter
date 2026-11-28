# V-Belt (`vbelt`)

Endless trapezoidal friction V-belt with an explicit top width, radial height, and included flank angle.

## Example Model String

```text
vbelt_l500mm_w10mm_h6mm_customv_sideangle40deg_endless
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `l<length>` | `length` | `500 mm` | Outer loop circumference |
| `w<length>` | `topWidth` | `10 mm` | Outer trapezoidal top width |
| `h<length>` | `height` | `6 mm` | Radial belt section height |
| `customv` | `customV` | `true` | Value-free custom trapezoidal section flag |
| `sideangle<deg>` | `sideAngle` | `40 deg` | Included V flank angle |
| `endless` | `endless` | `true` | Value-free endless closed-loop flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Center of the circular free-loop belt on the lower edge (`bottomZ = 0`, `topZ = topWidth`).
