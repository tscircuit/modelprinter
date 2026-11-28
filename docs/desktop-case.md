# Desktop Case (`desktopcase`)

Low-profile desktop instrument enclosure with a recessed front bezel lip and a four-corner bottom screw cover.

## Example Model String

```text
desktopcase_w160mm_d120mm_h50mm_wall2mm_corner4mm_bezel5mm_bottomscrewlid_screws4_hp(140mm,100mm)
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `w<length>` | `width` | `160 mm` | Exterior width |
| `d<length>` | `depth` | `120 mm` | Exterior front-to-rear depth |
| `h<length>` | `height` | `50 mm` | Exterior height |
| `wall<length>` | `wallThickness` | `2 mm` | Shell thickness |
| `corner<length>` | `cornerRadius` | `4 mm` | Exterior corner radius |
| `bezel<length>` | `bezelDepth` | `5 mm` | Front bezel lip inset depth |
| `bottomscrewlid` | `bottomScrewLid` | `true` | Value-free removable bottom plate flag |
| `screws4` | `screws` | `4` | Corner boss screw count |
| `hp(x,y)` | `holePitchX`, `holePitchY` | `140 mm`, `100 mm` | Bottom screw grid |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Centered on the lower base plane (`bottomZ = 0`, `topZ = height`).
