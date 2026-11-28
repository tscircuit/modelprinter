# Grounding Busbar (`groundingbusbar`)

Rectangular ground busbar with front conductor bores, top clamping screw threads, and two end mounting holes.

## Example Model String

```text
groundingbusbar_l80mm_w15mm_t5mm_bores8_bore4mm_p8mm_screwm4_mounts2_hole4mm_hp68mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `l<length>` | `length` | `80 mm` | Overall bar length |
| `w<length>` | `width` | `15 mm` | Standing bar height / width |
| `t<length>` | `thickness` | `5 mm` | Bar cross-section thickness |
| `bores<count>` | `bores` | `8` | Number of front conductor bores |
| `bore<length>` | `boreDiameter` | `4 mm` | Conductor bore diameter |
| `p<length>` | `pitch` | `8 mm` | Conductor bore center-to-center pitch |
| `screwm<size>` | `screwThread` | `"m4"` | Top clamping screw thread |
| `mounts2` | `mounts` | `2` | End mounting hole count |
| `hole<length>` | `holeDiameter` | `4 mm` | End mounting hole diameter |
| `hp<length>` | `holePitch` | `68 mm` | End mounting hole pitch |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Center of the bottom resting face (`bottomZ = 0`, `topZ = width`).
