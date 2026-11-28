# Thread-Cutting Screw (`threadcuttingscrew`)

Metric pan-head Phillips machine screw with axial thread-cutting chip flutes at its leading tip.

## Example Model String

```text
threadcuttingscrew_custom_m4_l16mm_fullthread_panhead_headod8mm_headh3mm_phillips_flutes4_flutel4mm_flutew0.8mm_flutedepth0.6mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `m<size>` | `thread` | `"m4"` | Nominal metric thread |
| `l<length>` | `length` | `16 mm` | Under-head shank length |
| `fullthread` | `fullThread` | `true` | Value-free full-thread flag |
| `panhead` | `panHead` | `true` | Value-free pan head flag |
| `headod<length>` | `headOuterDiameter` | `8 mm` | Pan head diameter |
| `headh<length>` | `headHeight` | `3 mm` | Pan head height |
| `phillips` | `phillips` | `true` | Value-free Phillips drive flag |
| `flutes<int>` | `flutes` | `4` | Tip cutting flute count |
| `flutel<length>` | `fluteLength` | `4 mm` | Axial flute length |
| `flutew<length>` | `fluteWidth` | `0.8 mm` | Flute slot width |
| `flutedepth<length>` | `fluteDepth` | `0.6 mm` | Radial flute depth |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Under-head bearing plane (`topZ = headHeight`, `bottomZ = -length`).
