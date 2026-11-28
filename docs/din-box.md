# DIN-Rail Control Housing (`dinbox`)

Modular DIN-rail control housing with a rear TH35x7.5 hook/latch, top and bottom terminal openings, and screw-on front cover.

## Example Model String

```text
dinbox_w45mm_d90mm_h75mm_wall2mm_th35x7.5_rearlowerclip_topbottomterminals_screwonlid
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `w<length>` | `width` | `45 mm` | Horizontal module width |
| `d<length>` | `depth` | `90 mm` | Front-to-rear depth |
| `h<length>` | `height` | `75 mm` | Vertical height across DIN rail |
| `wall<length>` | `wallThickness` | `2 mm` | Housing shell thickness |
| `th35x7.5` | `th35x75` | `true` | Value-free EN 60715 TH35x7.5 rail interface flag |
| `rearlowerclip` | `rearLowerClip` | `true` | Value-free rear lower DIN latch flag |
| `topbottomterminals` | `topBottomTerminals` | `true` | Value-free top/bottom terminal window flag |
| `screwonlid` | `screwOnLid` | `true` | Value-free screw-fastened front cover flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Centered on the rear DIN-rail mounting plane (`bottomZ = 0`, `topZ = depth`).
