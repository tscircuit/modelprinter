# Shoulder Washer (`shoulderwasher`)

Top-hat round insulating shoulder washer with a flat flange and stepped tubular boss (roadmap #13, item 0313).

## Example Model String

```text
shoulderwasher_custom_id3.2mm_od8mm_flangeh1mm_bossod5mm_bossl3mm_round
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `id<length>` | `innerDiameter` | `3.2 mm` | Through screw clearance bore |
| `od<length>` | `outerDiameter` | `8 mm` | Flat flange outside diameter |
| `flangeh<length>` | `flangeHeight` | `1 mm` | Axial flange thickness |
| `bossod<length>` | `bossOuterDiameter` | `5 mm` | Stepped insulating sleeve OD |
| `bossl<length>` | `bossLength` | `3 mm` | Axial boss length above flange |
| `round` | `round` | `true` | Value-free round form flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Bottom face of flange (`bottomZ = 0`, `topZ = flangeHeight + bossLength`).
