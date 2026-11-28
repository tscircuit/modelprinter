# Vent Panel (`ventpanel`)

Sheet-metal louvered ventilation cover plate with horizontal stamped hoods and four corner mounting holes.

## Example Model String

```text
ventpanel_w100mm_h60mm_t1mm_louvers6_p8mm_slitw80mm_louverdepth3mm_holes4_hole3mm_hp(90mm,50mm)
```

## Parameters

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `w<length>` | `width` | `100 mm` | Panel width |
| `h<length>` | `height` | `60 mm` | Panel height |
| `t<length>` | `thickness` | `1 mm` | Sheet thickness |
| `louvers<int>` | `louvers` | `6` | Horizontal louver count |
| `p<length>` | `louverPitch` | `8 mm` | Vertical spacing between louvers |
| `slitw<length>` | `slitWidth` | `80 mm` | Horizontal louver opening width |
| `louverdepth<length>` | `louverDepth` | `3 mm` | Forward hood projection |
| `holes4` | `holes` | `4` | Corner mounting hole count |
| `hole<length>` | `holeDiameter` | `3 mm` | Corner mounting hole diameter |
| `hp(x,y)` | `holePitchX`, `holePitchY` | `90 mm`, `50 mm` | Corner hole grid |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Centered on rear mounting plane (`bottomZ = 0`, `topZ = thickness + louverDepth`).
