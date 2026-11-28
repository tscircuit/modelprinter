# Wing Screw (`wingscrew`)

Fully threaded metric thumb screw with two upright plate wings on a central cylindrical boss.

## Example Model String

```text
wingscrew_custom_m5_l20mm_fullthread_twinwing_wingw28mm_wingh12mm_wingth3mm_bossod9mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `m<size>` | `thread` | `"m5"` | Nominal metric thread |
| `l<length>` | `length` | `20 mm` | Under-head threaded shank length |
| `fullthread` | `fullThread` | `true` | Value-free full-thread shank flag |
| `twinwing` | `twinWing` | `true` | Value-free opposing upright wings flag |
| `wingw<length>` | `wingSpan` | `28 mm` | Tip-to-tip overall wing span |
| `wingh<length>` | `wingHeight` | `12 mm` | Upright wing height above bearing plane |
| `wingth<length>` | `wingThickness` | `3 mm` | Wing plate thickness |
| `bossod<length>` | `bossOuterDiameter` | `9 mm` | Central circular head boss OD |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Under-head boss bearing plane (`topZ = wingHeight`, `bottomZ = -length`).
