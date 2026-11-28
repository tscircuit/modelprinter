# Sex Bolt / Binding Post (`sexbolt`)

Two-part Chicago binding fastener consisting of a flanged internally threaded barrel and a mating slotted flange screw.

## Example Model String

```text
sexbolt_custom_m4_barrelod6mm_barrell10mm_flangeod10mm_flangeh1.5mm_screwl8mm_slotted_slotw1mm_slotdepth0.8mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `m<size>` | `thread` | `"m4"` | Internal metric thread |
| `barrelod<length>` | `barrelOuterDiameter` | `6 mm` | Female barrel OD |
| `barrell<length>` | `barrelLength` | `10 mm` | Clamping grip length |
| `flangeod<length>` | `flangeOuterDiameter` | `10 mm` | End flange diameter |
| `flangeh<length>` | `flangeHeight` | `1.5 mm` | End flange thickness |
| `screwl<length>` | `screwLength` | `8 mm` | Male screw engagement length |
| `slotted` | `slotted` | `true` | Value-free slotted screw head flag |
| `slotw<length>` | `slotWidth` | `1 mm` | Driver slot width |
| `slotdepth<length>` | `slotDepth` | `0.8 mm` | Driver slot depth |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Inside bearing face of the female barrel flange (`bottomZ = -flangeHeight`, `topZ = barrelLength + flangeHeight`).
