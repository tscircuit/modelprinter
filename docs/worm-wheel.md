# Worm Wheel (`wormwheel`)

Throated cylindrical worm wheel with concave helical teeth and a keyed shaft bore.

## Example Model String

```text
wormwheel_teeth30_axialmodule2mm_bore10mm_w15mm_axialpa20deg_righthand_starts1_wormpd20mm_keyway_keyw3mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `teeth<int>` | `teeth` | `30` | Worm wheel tooth count |
| `axialmodule<length>` | `axialModule` | `2 mm` | Transverse module (worm axial module) |
| `bore<length>` | `boreDiameter` | `10 mm` | Central shaft bore diameter |
| `w<length>` | `width` | `15 mm` | Face width |
| `axialpa<deg>` | `axialPressureAngle` | `20 deg` | Axial pressure angle |
| `righthand` / `lefthand` | `rightHand` | `true` | Value-free helix hand flags |
| `starts<int>` | `starts` | `1` | Mating worm start count |
| `wormpd<length>` | `wormPitchDiameter` | `20 mm` | Mating worm pitch diameter |
| `keyway` | `keyway` | `true` | Value-free keyway bore flag |
| `keyw<length>` | `keyWidth` | `3 mm` | Keyway slot width |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Bore axis on the lower wheel face (`bottomZ = 0`, `topZ = width`).
