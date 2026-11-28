# Timing Pulley (`timingpulley`)

Unflanged HTD 5M curvilinear synchronous timing pulley with a cylindrical shaft bore and radial set-screw hole.

## Example Model String

```text
timingpulley_teeth20_pitch5mm_bore5mm_w17mm_htd5m_setscrew_m3
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `teeth<int>` | `teeth` | `20` | Synchronous groove count |
| `pitch<length>` | `pitch` | `5 mm` | Tooth circular pitch (5 mm for HTD 5M) |
| `bore<length>` | `boreDiameter` | `5 mm` | Central shaft bore diameter |
| `w<length>` | `width` | `17 mm` | Axial pulley face width |
| `htd5m` | `htd5m` | `true` | Value-free HTD 5M tooth profile flag |
| `setscrew` | `setScrew` | `true` | Value-free radial set-screw hub flag |
| `m<size>` | `thread` | `"m3"` | Radial set-screw metric thread |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Bore centerline on the lower pulley face (`bottomZ = 0`, `topZ = width`).
