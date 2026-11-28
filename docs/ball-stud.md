# Ball Stud (`ballstud`)

Metric ball stud for gas-spring and linkage sockets, featuring a spherical ball head, reduced cylindrical neck, hex wrench shoulder, and threaded shank.

## Example Model String

```text
ballstud_custom_m6_l15mm_balld10mm_neckd5mm_neckl4mm_shoulderaf10mm_shoulderh3mm_fullthread
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `m<size>` | `thread` | `"m6"` | Mounting shank metric thread |
| `l<length>` | `threadLength` | `15 mm` | Threaded shank length below shoulder |
| `balld<length>` | `ballDiameter` | `10 mm` | Spherical articulation ball OD |
| `neckd<length>` | `neckDiameter` | `5 mm` | Reduced neck diameter |
| `neckl<length>` | `neckLength` | `4 mm` | Neck length above shoulder |
| `shoulderaf<length>` | `shoulderAcrossFlats` | `10 mm` | Hex wrench shoulder across-flats |
| `shoulderh<length>` | `shoulderHeight` | `3 mm` | Hex shoulder height |
| `fullthread` | `fullThread` | `true` | Value-free full-thread shank flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Lower bearing face of hex shoulder (`bottomZ = -threadLength`, `ballCenterZ = shoulderHeight + neckLength + ballDiameter / 2`).
