# Dual-Bevel V-Slot Guide Wheel (`vslotwheel`)

Dual-bevel linear V-track roller wheel with recessed bearing seats and central axle bore.

## Example Model String

```text
vslotwheel_od24mm_w11mm_bore5mm_includedangle90deg_dualbevel_bearingseat16mm_axlebore
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `od<length>` | `outerDiameter` | `24 mm` | Outer crest diameter |
| `w<length>` | `width` | `11 mm` | Axial wheel width |
| `bore<length>` | `boreDiameter` | `5 mm` | Central axle bore |
| `includedangle<deg>` | `includedAngleDeg` | `90 deg` | Included angle across V-bevels |
| `dualbevel` | `dualBevel` | `true` | Value-free dual-bevel tread flag |
| `bearingseat<length>` | `bearingSeatDiameter` | `16 mm` | Recessed bearing bore diameter |
| `axlebore` | `axleBore` | `true` | Value-free axle bore mount flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Wheel mid-plane on the axle centerline (`bottomZ = -width / 2`, `topZ = width / 2`).
