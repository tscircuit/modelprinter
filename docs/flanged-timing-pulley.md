# Flanged Timing Pulley (`flangedtimingpulley`)

Curvilinear HTD 5M timing belt pulley with dual belt-retaining side flanges, cylindrical shaft bore, and radial set screw.

## Example Model String

```text
flangedtimingpulley_teeth20_pitch5mm_bore5mm_w17mm_flangeod37mm_htd5m_setscrew_m3
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `teeth<count>` | `teeth` | `20` | Number of pulley teeth |
| `pitch<length>` | `pitch` | `5 mm` | Circular tooth pitch (`5 mm` for HTD 5M) |
| `bore<length>` | `boreDiameter` | `5 mm` | Central shaft bore diameter |
| `w<length>` | `width` | `17 mm` | Overall axial width across side flanges |
| `flangeod<length>` | `flangeOuterDiameter` | `37 mm` | Side retaining flange outer diameter |
| `htd5m` | `htd5m` | `true` | Value-free HTD 5M tooth profile flag |
| `setscrew` | `setScrew` | `true` | Value-free radial set-screw mount flag |
| `m<size>` | `setScrewThread` | `"m3"` | Nominal set-screw thread |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Pulley mid-plane on the bore centerline (`bottomZ = -width / 2`, `topZ = width / 2`).
