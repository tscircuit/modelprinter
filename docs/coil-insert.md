# Coil Insert (`coilinsert`)

Helical diamond-section wire-thread insert with an inward-bent installation tang at the bottom end.

## Example Model String

```text
coilinsert_custom_m3_l4.5mm_od3.7mm_turns9_diamond_wire0.35mm_benttang_sectionangle60deg
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `m<size>` | `thread` | `"m3"` | Nominal internal metric thread |
| `l<length>` | `length` | `4.5 mm` | Coil axial length |
| `od<length>` | `outerDiameter` | `3.7 mm` | Free-state coil outer diameter |
| `turns<num>` | `turns` | `9` | Active helical coil turns |
| `diamond` | `diamond` | `true` | Value-free diamond wire cross-section flag |
| `wire<length>` | `wireWidth` | `0.35 mm` | Radial diamond wire thickness |
| `benttang` | `bentTang` | `true` | Value-free inward installation tang flag |
| `sectionangle<deg>` | `sectionAngle` | `60 deg` | Included flank angle |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Coil axis at the lower tang end (`bottomZ = 0`, `topZ = length`).
