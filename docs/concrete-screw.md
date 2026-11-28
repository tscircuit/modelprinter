# Concrete Screw (`concretescrew`)

Hex-flange Hi-Lo masonry anchor screw with alternating high and low thread crests and a notched conical tip.

## Example Model String

```text
concretescrew_custom_d6mm_core4mm_l50mm_threadpitch2mm_righthanded_hilothread_lowd5mm_hexflange_af8mm_flangeod11mm_headh4mm_notchedconetip_cuts2_cutl5mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `d<length>` | `diameter` | `6 mm` | High thread crest OD |
| `core<length>` | `coreDiameter` | `4 mm` | Root core diameter |
| `l<length>` | `length` | `50 mm` | Under-head length |
| `threadpitch<length>` | `threadPitch` | `2 mm` | Hi-Lo thread pitch |
| `righthanded` / `lefthanded` | `rightHanded` | `true` | Thread hand flags |
| `hilothread` | `hiLoThread` | `true` | Value-free alternating Hi-Lo thread flag |
| `lowd<length>` | `lowCrestDiameter` | `5 mm` | Low crest diameter (`core < lowd < d`) |
| `hexflange` | `hexFlange` | `true` | Value-free hex-flange head flag |
| `af<length>` | `acrossFlats` | `8 mm` | Hex across-flats |
| `flangeod<length>` | `flangeOuterDiameter` | `11 mm` | Flange OD |
| `headh<length>` | `headHeight` | `4 mm` | Head height |
| `notchedconetip` | `notchedConeTip` | `true` | Value-free notched point flag |
| `cuts<int>` | `cuts` | `2` | Tip cutting notch count |
| `cutl<length>` | `cutLength` | `5 mm` | Tip notch length |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Under-head flange bearing plane (`topZ = headHeight`, `bottomZ = -length`).
