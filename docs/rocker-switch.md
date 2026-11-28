# Snap-In Panel Rocker Switch (`rockerswitch`)

Rectangular snap-in panel rocker switch with curved actuator, side retaining clips, and rear quick-connect blades.

## Example Model String

```text
rockerswitch_cutout(21mm,15mm)_bodyd25mm_flange2mm_curvedrocker_clips2_contacts3_tabs(4.8mm,0.8mm)
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `cutout(<l>,<w>)` | `cutoutLength`, `cutoutWidth` | `21 mm`, `15 mm` | Rectangular panel cutout dimensions |
| `bodyd<length>` | `bodyDepth` | `25 mm` | Rear switch depth below panel |
| `flange<length>` | `flangeBorder` | `2 mm` | Front bezel flange border width/height |
| `curvedrocker` | `curvedRocker` | `true` | Value-free curved rocker actuator flag |
| `clips2` | `clips` | `2` | Opposed snap-in retaining clip count |
| `contacts<count>` | `contacts` | `3` | Rear quick-connect blade count (`2` or `3`) |
| `tabs(<w>,<t>)` | `tabWidth`, `tabThickness` | `4.8 mm`, `0.8 mm` | Quick-connect blade width and thickness |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Front panel seating plane at cutout center (`bottomZ = -bodyDepth`, `topZ = flangeBorder`).
