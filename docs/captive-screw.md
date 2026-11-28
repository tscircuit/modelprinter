# Captive Screw (`captivescrew`)

Pan-head Phillips captive panel screw with a reduced unthreaded retention neck above the threaded tip.

## Example Model String

```text
captivescrew_custom_m3_l12mm_threadl9mm_neckd2.4mm_neckl3mm_panhead_headod5.5mm_headh2mm_phillips
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `m<size>` | `thread` | `"m3"` | Nominal metric thread |
| `l<length>` | `length` | `12 mm` | Under-head length (`neckLength + threadLength`) |
| `threadl<length>` | `threadLength` | `9 mm` | Lower threaded tip length |
| `neckd<length>` | `neckDiameter` | `2.4 mm` | Reduced panel-retention neck diameter |
| `neckl<length>` | `neckLength` | `3 mm` | Reduced neck length below head |
| `panhead` | `panHead` | `true` | Value-free pan head flag |
| `headod<length>` | `headOuterDiameter` | `5.5 mm` | Pan head diameter |
| `headh<length>` | `headHeight` | `2 mm` | Pan head height |
| `phillips` | `phillips` | `true` | Value-free Phillips drive flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Under-head bearing plane (`topZ = headHeight`, `bottomZ = -length`).
