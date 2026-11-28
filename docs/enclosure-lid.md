# Enclosure Lid (`enclosurelid`)

Flat rectangular enclosure cover with an inset locating rim and four corner clearance screw holes.

## Example Model String

```text
enclosurelid_w100mm_d70mm_t2mm_corner3mm_rimw2mm_rimdepth6mm_holes4_hole3mm_hp(88mm,58mm)
```

## Parameters

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `w<length>` | `width` | `100 mm` | Exterior cover width |
| `d<length>` | `depth` | `70 mm` | Exterior cover depth |
| `t<length>` | `thickness` | `2 mm` | Cover plate thickness |
| `corner<length>` | `cornerRadius` | `3 mm` | Exterior corner radius |
| `rimw<length>` | `rimWidth` | `2 mm` | Inset locating skirt wall width |
| `rimdepth<length>` | `rimDepth` | `6 mm` | Downward locating rim depth |
| `holes4` | `holes` | `4` | Corner clearance hole count |
| `hole<length>` | `holeDiameter` | `3 mm` | Screw clearance hole diameter |
| `hp(x,y)` | `holePitchX`, `holePitchY` | `88 mm`, `58 mm` | Corner screw grid |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Centered on the underside mating face (`topZ = thickness`, `bottomZ = -rimDepth`).
