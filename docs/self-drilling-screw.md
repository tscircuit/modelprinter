# Self-Drilling Screw (`selfdrillingscrew`)

Hex-flange self-drilling tapping screw with an integral two-flute drill point.

## Example Model String

```text
selfdrillingscrew_custom_d4.2mm_core3.1mm_threadpitch1.4mm_righthanded_l19mm_threadl14mm_hexflange_af7mm_headh4mm_flangeod9.5mm_drilll5mm_flutes2_pointangle118deg
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `d<length>` | `diameter` | `4.2 mm` | Outer thread crest diameter |
| `core<length>` | `coreDiameter` | `3.1 mm` | Thread root core diameter |
| `threadpitch<length>` | `threadPitch` | `1.4 mm` | Axial tapping pitch |
| `righthanded` / `lefthanded` | `rightHanded` | `true` | Thread hand flags |
| `l<length>` | `length` | `19 mm` | Under-head length |
| `threadl<length>` | `threadLength` | `14 mm` | Threaded section length |
| `hexflange` | `hexFlange` | `true` | Value-free washer-flange hex head flag |
| `af<length>` | `acrossFlats` | `7 mm` | Wrench hex across-flats |
| `headh<length>` | `headHeight` | `4 mm` | Combined head and flange height |
| `flangeod<length>` | `flangeOuterDiameter` | `9.5 mm` | Bearing flange outer diameter |
| `drilll<length>` | `drillLength` | `5 mm` | Fluted drill tip length |
| `flutes<int>` | `flutes` | `2` | Drill flute count |
| `pointangle<deg>` | `pointAngle` | `118 deg` | Drill tip included cone angle |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Under-head flange bearing plane (`topZ = headHeight`, `bottomZ = -length`).
