# Square Fan Filter Cassette (`fanfilter`)

Square fan filter cassette with orthogonal front grille, recessed filter media pad, and four corner fixing holes.

## Example Model String

```text
fanfilter_w60mm_h60mm_d8mm_framet2mm_media(46mm,46mm,3mm)_grillep6mm_hole4mm_hp(50mm,50mm)
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `w<length>` | `width` | `60 mm` | Outer cassette width |
| `h<length>` | `height` | `60 mm` | Outer cassette height |
| `d<length>` | `depth` | `8 mm` | Overall cassette depth |
| `framet<length>` | `frameThickness` | `2 mm` | Perimeter frame wall thickness |
| `media(<w>,<h>,<t>)` | `mediaWidth`, `mediaHeight`, `mediaThickness` | `46`, `46`, `3 mm` | Recessed filter pad dimensions |
| `grillep<length>` | `grillePitch` | `6 mm` | Front orthogonal grille bar pitch |
| `hole<length>` | `holeDiameter` | `4 mm` | Corner mounting hole diameter |
| `hp(<x>,<y>)` | `holePitchX`, `holePitchY` | `50 mm`, `50 mm` | Corner mounting hole grid |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Rear fan-mating face center (`bottomZ = 0`, `topZ = depth`).
