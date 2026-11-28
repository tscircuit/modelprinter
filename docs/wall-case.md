# Wall Case (`wallcase`)

Wall-mounted rectangular cabinet shell with a left-pivoting hinged front door and four rear mounting holes.

## Example Model String

```text
wallcase_w200mm_d80mm_h250mm_wall3mm_corner3mm_leftpivotdoor_mounts4_hole6mm_hp(180mm,220mm)
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `w<length>` | `width` | `200 mm` | Cabinet width |
| `d<length>` | `depth` | `80 mm` | Front-to-rear depth |
| `h<length>` | `height` | `250 mm` | Cabinet height |
| `wall<length>` | `wallThickness` | `3 mm` | Shell thickness |
| `corner<length>` | `cornerRadius` | `3 mm` | Exterior corner radius |
| `leftpivotdoor` | `leftPivotDoor` | `true` | Value-free left-hinged door flag |
| `mounts4` | `mounts` | `4` | Rear mounting hole count |
| `hole<length>` | `holeDiameter` | `6 mm` | Rear mounting hole diameter |
| `hp(x,y)` | `holePitchX`, `holePitchY` | `180 mm`, `220 mm` | Rear mounting hole grid |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Centered on the rear wall-mounting face (`bottomZ = 0`, `topZ = depth`).
