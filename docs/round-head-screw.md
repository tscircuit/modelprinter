# Round-Head Screw (`roundheadscrew`)

Slotted metric machine screw with a true hemispherical dome head and fully threaded shank.

## Example Model String

```text
roundheadscrew_custom_m3_l10mm_fullthread_hemisphere_headod5.5mm_headh2.75mm_slotted_slotw0.8mm_slotdepth1mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `m<size>` | `thread` | `"m3"` | Nominal metric thread |
| `l<length>` | `length` | `10 mm` | Under-head threaded shank length |
| `fullthread` | `fullThread` | `true` | Value-free full-thread flag |
| `hemisphere` | `hemisphere` | `true` | Value-free hemispherical dome flag |
| `headod<length>` | `headOuterDiameter` | `5.5 mm` | Hemispherical head base diameter |
| `headh<length>` | `headHeight` | `2.75 mm` | Dome height (`headOuterDiameter / 2`) |
| `slotted` | `slotted` | `true` | Value-free slotted drive flag |
| `slotw<length>` | `slotWidth` | `0.8 mm` | Driver slot width |
| `slotdepth<length>` | `slotDepth` | `1 mm` | Driver slot depth |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Under-head bearing plane (`topZ = headHeight`, `bottomZ = -length`).
