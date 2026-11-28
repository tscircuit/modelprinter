# Terminal Cover (`terminalcover`)

Open-ended U-hood finger guard over a terminal strip with outward mounting feet and two fixing holes (roadmap #13, item 0561).

## Example Model String

```text
terminalcover_w70mm_d35mm_h20mm_t2mm_uhood_feet5mm_holes2_hole3mm_hp60mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `w<length>` | `width` | `70 mm` | Hood length along terminal strip |
| `d<length>` | `depth` | `35 mm` | Hood span across strip |
| `h<length>` | `height` | `20 mm` | Overall hood height |
| `t<length>` | `thickness` | `2 mm` | Wall thickness |
| `uhood` | `uHood` | `true` | Value-free U-hood form flag |
| `feet<length>` | `footWidth` | `5 mm` | Outward mounting foot projection |
| `holes2` | `holes` | `2` | Fixing hole count |
| `hole<length>` | `holeDiameter` | `3 mm` | Fixing hole diameter |
| `hp<length>` | `holePitch` | `60 mm` | Fixing hole center spacing |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Base mounting plane center (`bottomZ = 0`, `topZ = height`).
