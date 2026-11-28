# Wire Finger Fan Guard (`fanguard`)

Concentric wire finger guard with radial spoke arms and four corner mounting eyes.

## Example Model String

```text
fanguard_od40mm_wire1mm_rings3_ringod(16mm,28mm,40mm)_spokes4_tabs4_hole3.5mm_hp(32mm,32mm)
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `od<length>` | `outerDiameter` | `40 mm` | Outer ring diameter |
| `wire<length>` | `wireDiameter` | `1 mm` | Round wire diameter |
| `rings<count>` | `rings` | `3` | Concentric wire ring count |
| `ringod(<d1,...>)` | `ringOuterDiameters` | `[16, 28, 40]` | Ascending ring outer diameters |
| `spokes<count>` | `spokes` | `4` | Radial support spoke count |
| `tabs4` | `tabs` | `4` | Corner mounting eye count |
| `hole<length>` | `holeDiameter` | `3.5 mm` | Corner mounting eye inner diameter |
| `hp(<x>,<y>)` | `holePitchX`, `holePitchY` | `32 mm`, `32 mm` | Corner eye center-to-center pitch |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Fan mounting face center (`bottomZ = 0`, `topZ = 2 * wireDiameter`).
