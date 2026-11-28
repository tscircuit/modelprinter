# Thumb Screw (`thumbscrew`)

Straight-knurled cylindrical-head hand screw with a fully threaded metric shank and chamfered tip.

## Example Model String

```text
thumbscrew_custom_m4_l12mm_headod12mm_headh6mm_straightknurl_knurlp1mm_fullthread_chamfertip
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `m<size>` | `thread` | `"m4"` | Nominal metric thread |
| `l<length>` | `length` | `12 mm` | Under-head threaded shank length |
| `headod<length>` | `headOuterDiameter` | `12 mm` | Knurled head outer diameter |
| `headh<length>` | `headHeight` | `6 mm` | Cylindrical head height |
| `straightknurl` | `straightKnurl` | `true` | Value-free axial straight knurling flag |
| `knurlp<length>` | `knurlPitch` | `1 mm` | Circumferential knurl ridge pitch |
| `fullthread` | `fullThread` | `true` | Value-free full-thread shank flag |
| `chamfertip` | `chamferTip` | `true` | Value-free chamfered point flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Under-head bearing plane (`topZ = headHeight`, `bottomZ = -length`).
