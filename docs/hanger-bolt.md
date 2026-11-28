# Hanger Bolt (`hangerbolt`)

Headless dual-thread hanger bolt with a metric machine-thread stud at `+Z`, pointed coarse wood thread at `-Z`, and two center wrench flats.

## Example Model String

```text
hangerbolt_custom_m6_l50mm_machinethreadl25mm_woodd6mm_woodthreadpitch2.6mm_woodthreadl25mm_centerflats_flats2_af5mm_flatl4mm_conetip
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `m<size>` | `thread` | `"m6"` | Machine-end metric thread |
| `l<length>` | `length` | `50 mm` | Overall bolt length |
| `machinethreadl<length>` | `machineThreadLength` | `25 mm` | Machine-thread section length |
| `woodd<length>` | `woodDiameter` | `6 mm` | Wood-thread outer diameter |
| `woodthreadpitch<length>` | `woodThreadPitch` | `2.6 mm` | Coarse wood thread pitch |
| `woodthreadl<length>` | `woodThreadLength` | `25 mm` | Pointed wood-thread length |
| `centerflats` | `centerFlats` | `true` | Value-free center wrench flats flag |
| `flats2` | `flats` | `2` | Opposing wrench flat count |
| `af<length>` | `acrossFlats` | `5 mm` | Wrench across-flats width |
| `flatl<length>` | `flatLength` | `4 mm` | Axial wrench flat length |
| `conetip` | `coneTip` | `true` | Value-free pointed wood tip flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Transition plane at top of wood-thread section (`bottomZ = -woodThreadLength`, `topZ = length - woodThreadLength`).
