# Terminal Barrier Strip (`terminalbarrier`)

Multi-station insulating barrier terminal strip with tall divider walls, top clamping screws, and two end mounting ears.

## Example Model String

```text
terminalbarrier_p8mm_n4_w40mm_d20mm_h15mm_screwm3_barriert2mm_holes2_hole3mm_hp32mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `p<length>` | `pitch` | `8 mm` | Station-to-station pitch |
| `n<count>` | `poles` | `4` | Number of screw terminal stations |
| `w<length>` | `width` | `40 mm` | Overall strip width including end ears |
| `d<length>` | `depth` | `20 mm` | Front-to-back strip depth |
| `h<length>` | `height` | `15 mm` | Overall barrier wall height |
| `screwm<size>` | `screwThread` | `"m3"` | Nominal top clamp screw thread |
| `barriert<length>` | `barrierThickness` | `2 mm` | Insulating divider wall thickness |
| `holes2` | `holes` | `2` | End ear mounting hole count |
| `hole<length>` | `holeDiameter` | `3 mm` | End mounting hole diameter |
| `hp<length>` | `holePitch` | `32 mm` | Center-to-center mounting hole pitch |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Center of the bottom mounting face (`bottomZ = 0`, `topZ = height`).
