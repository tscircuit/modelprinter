# Truss-Head Screw (`trussheadscrew`)

Wide low-profile spherical-cap truss-head machine screw with a Phillips cross recess.

## Example Model String

```text
trussheadscrew_custom_m4_l16mm_fullthread_headod10mm_headh2mm_sphericalcap_phillips
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `m<size>` | `thread` | `"m4"` | Nominal metric thread |
| `l<length>` | `length` | `16 mm` | Under-head threaded shank length |
| `fullthread` | `fullThread` | `true` | Value-free full-thread shank flag |
| `headod<length>` | `headOuterDiameter` | `10 mm` | Wide truss head diameter |
| `headh<length>` | `headHeight` | `2 mm` | Low spherical-cap dome height |
| `sphericalcap` | `sphericalCap` | `true` | Value-free spherical-cap head flag |
| `phillips` | `phillips` | `true` | Value-free cross-recess drive flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Under-head bearing plane (`topZ = headHeight`, `bottomZ = -length`).
