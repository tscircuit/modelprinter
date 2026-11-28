# Wood Screw (`woodscrew`)

Part-threaded countersunk wood screw with a Phillips cross recess and conical point.

## Example Model String

```text
woodscrew_custom_d4mm_core2.5mm_l25mm_threadl18mm_threadpitch2mm_righthanded_countersunk_headod8mm_headangle90deg_phillips_conetip
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `d<length>` | `diameter` | `4 mm` | Outer thread crest diameter |
| `core<length>` | `coreDiameter` | `2.5 mm` | Thread root core diameter |
| `l<length>` | `length` | `25 mm` | Overall flush-head screw length |
| `threadl<length>` | `threadLength` | `18 mm` | Threaded tip length |
| `threadpitch<length>` | `threadPitch` | `2 mm` | Coarse axial thread pitch |
| `righthanded` / `lefthanded` | `rightHanded` | `true` | Value-free thread hand flags |
| `countersunk` | `countersunk` | `true` | Value-free countersunk head flag |
| `headod<length>` | `headOuterDiameter` | `8 mm` | Flush top head diameter |
| `headangle<deg>` | `headAngle` | `90 deg` | Included countersink cone angle |
| `phillips` | `phillips` | `true` | Value-free Phillips drive flag |
| `conetip` | `coneTip` | `true` | Value-free conical point flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Center of flush countersunk head top face (`topZ = 0`, `bottomZ = -length`).
