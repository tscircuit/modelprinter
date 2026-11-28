# Lag Screw (`lagscrew`)

Hex-head part-threaded coarse timber lag screw with a smooth upper shank and conical tip.

## Example Model String

```text
lagscrew_custom_d6mm_core4.2mm_l40mm_threadl26mm_threadpitch2.6mm_righthanded_af10mm_headh4mm_hexhead_hexdrive_conetip
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `d<length>` | `diameter` | `6 mm` | Outer shank/thread diameter |
| `core<length>` | `coreDiameter` | `4.2 mm` | Root core diameter |
| `l<length>` | `length` | `40 mm` | Under-head length |
| `threadl<length>` | `threadLength` | `26 mm` | Pointed coarse thread length |
| `threadpitch<length>` | `threadPitch` | `2.6 mm` | Axial lag thread pitch |
| `righthanded` / `lefthanded` | `rightHanded` | `true` | Thread hand flags |
| `af<length>` | `acrossFlats` | `10 mm` | Hex wrench across-flats |
| `headh<length>` | `headHeight` | `4 mm` | Hex head height |
| `hexhead` | `hexHead` | `true` | Value-free hex head flag |
| `hexdrive` | `hexDrive` | `true` | Value-free external hex wrench flag |
| `conetip` | `coneTip` | `true` | Value-free conical tip flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Under-head bearing plane (`topZ = headHeight`, `bottomZ = -length`).
