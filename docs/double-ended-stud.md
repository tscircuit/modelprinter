# Double-Ended Stud (`doubleendedstud`)

Headless cylindrical stud with two equal metric threaded ends separated by a smooth central shank.

## Example Model String

```text
doubleendedstud_custom_m6_l40mm_threadl12mm_equalends_smoothmiddle_chamfertip_chamfer0.5mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `m<size>` | `thread` | `"m6"` | Nominal metric thread |
| `l<length>` | `length` | `40 mm` | Overall stud length |
| `threadl<length>` | `threadLength` | `12 mm` | Length of each threaded end |
| `equalends` | `equalEnds` | `true` | Value-free symmetric threaded ends flag |
| `smoothmiddle` | `smoothMiddle` | `true` | Value-free unthreaded center shank flag |
| `chamfertip` | `chamferTip` | `true` | Value-free chamfered terminal ends flag |
| `chamfer<length>` | `chamfer` | `0.5 mm` | Terminal chamfer size |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Stud axis at the lower chamfered end (`bottomZ = 0`, `topZ = length`).
