# Pushbutton Box (`pushbuttonbox`)

Single-operator control station box with a centered 22.5 mm actuator cutout and four-screw top cover.

## Example Model String

```text
pushbuttonbox_w80mm_d80mm_h65mm_wall3mm_corner4mm_lidt3mm_hole22.5mm_screwonlid_screws4_hp(62mm,62mm)
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `w<length>` | `width` | `80 mm` | Exterior width |
| `d<length>` | `depth` | `80 mm` | Exterior depth |
| `h<length>` | `height` | `65 mm` | Overall assembled height |
| `wall<length>` | `wallThickness` | `3 mm` | Side/base wall thickness |
| `corner<length>` | `cornerRadius` | `4 mm` | Exterior corner radius |
| `lidt<length>` | `lidThickness` | `3 mm` | Top cover plate thickness |
| `hole<length>` | `cutoutDiameter` | `22.5 mm` | Centered operator cutout diameter |
| `screwonlid` | `screwOnLid` | `true` | Value-free four-screw cover flag |
| `screws4` | `screws` | `4` | Cover screw count |
| `hp(x,y)` | `holePitchX`, `holePitchY` | `62 mm`, `62 mm` | Corner cover screw pitch |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Centered on the lower mounting base (`bottomZ = 0`, `topZ = height`).
