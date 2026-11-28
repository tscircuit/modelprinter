# Panel Meter Case (`panelmetercase`)

1/8-DIN 96x48 mm panel instrument shell with a front window bezel, 92x45 mm rear sleeve, and two side spring retainers.

## Example Model String

```text
panelmetercase_w96mm_h48mm_d60mm_wall2mm_bezel3mm_cutout(92mm,45mm)_sidespring2clips_frontwindow
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `w<length>` | `width` | `96 mm` | Front bezel width |
| `h<length>` | `height` | `48 mm` | Front bezel height |
| `d<length>` | `depth` | `60 mm` | Overall front-to-rear depth |
| `wall<length>` | `wallThickness` | `2 mm` | Sleeve wall thickness |
| `bezel<length>` | `bezelThickness` | `3 mm` | Front bezel projection |
| `cutout(w,h)` | `cutoutWidth`, `cutoutHeight` | `92 mm`, `45 mm` | Panel cutout / sleeve envelope |
| `sidespring2clips` | `sideSpring2Clips` | `true` | Value-free side spring clip pair flag |
| `frontwindow` | `frontWindow` | `true` | Value-free front display window flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Centered on the panel front face (`topZ = bezelThickness`, `bottomZ = -(depth - bezelThickness)`).
