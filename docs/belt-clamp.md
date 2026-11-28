# Toothed Belt Clamp (`beltclamp`)

HTD 5M toothed belt-end clamp block with two base mounting holes.

## Example Model String

```text
beltclamp_w20mm_l30mm_h10mm_pitch5mm_htd5m_base2hole_holed4mm_holepitch20mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `w<length>` | `width` | `20 mm` | Clamp width across belt |
| `l<length>` | `length` | `30 mm` | Clamp length along belt |
| `h<length>` | `height` | `10 mm` | Clamp block height |
| `pitch<length>` | `pitch` | `5 mm` | Belt tooth pitch (`5 mm` for HTD 5M) |
| `htd5m` | `htd5m` | `true` | Value-free HTD 5M tooth profile flag |
| `base2hole` | `base2Hole` | `true` | Value-free 2-hole base mount flag |
| `holed<length>` | `holeDiameter` | `4 mm` | Base clearance hole diameter |
| `holepitch<length>` | `holePitch` | `20 mm` | Center-to-center hole pitch along length |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Center of the bottom mounting face (`bottomZ = 0`, `topZ = height`).
