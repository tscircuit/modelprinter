# Square Fan Adapter Mount Frame (`fanmountframe`)

Open square fan mounting shroud with central circular aperture, four inner fan bosses, and two outer mounting ears.

## Example Model String

```text
fanmountframe_w60mm_h60mm_d15mm_wall3mm_opening40mm_bossh5mm_fanhole3.5mm_hp(32mm,32mm)_ears2_mounthole4mm_earhp70mm_earw10mm_earl10mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `w<length>` | `width` | `60 mm` | Square frame width |
| `h<length>` | `height` | `60 mm` | Square frame height |
| `d<length>` | `depth` | `15 mm` | Shroud depth |
| `wall<length>` | `wallThickness` | `3 mm` | Outer shroud wall thickness |
| `opening<length>` | `openingDiameter` | `40 mm` | Circular airflow aperture |
| `bossh<length>` | `bossHeight` | `5 mm` | Inner fan boss height |
| `fanhole<length>` | `fanHoleDiameter` | `3.5 mm` | Fan boss hole diameter |
| `hp(<x>,<y>)` | `holePitchX`, `holePitchY` | `32 mm`, `32 mm` | Inner fan screw grid |
| `ears2` | `ears` | `2` | Outer side mounting ear count |
| `mounthole<length>` | `mountHoleDiameter` | `4 mm` | Ear mounting hole diameter |
| `earhp<length>` | `earHolePitch` | `70 mm` | Ear mounting hole pitch |
| `earw<length>` | `earWidth` | `10 mm` | Ear width |
| `earl<length>` | `earLength` | `10 mm` | Ear outward projection |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Base mounting plane center (`bottomZ = 0`, `topZ = depth`).
