# D-Shaft (`dshaft`)

Round drive shaft with a longitudinal D-profile flat located a specified radial distance from the shaft axis and chamfered ends (roadmap #13, item 0300).

## Example Model String

```text
dshaft_d8mm_l100mm_flatdistance1mm_flatlength90mm_endchamfer0.5mm
```

## Parameters

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `d<length>`, `od<length>` | `diameter` | `8 mm` | Nominal round shaft diameter |
| `l<length>`, `length<length>` | `length` | `100 mm` | Overall shaft length along +Z |
| `flatdistance<length>` | `flatDistance` | `1 mm` | Distance from shaft centerline to flat plane |
| `flatlength<length>` | `flatLength` | `90 mm` | Axial length of drive flat |
| `endchamfer<length>` | `endChamfer` | `0.5 mm` | 45-degree chamfer setback at both shaft ends |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Lower shaft end center (`bottomZ = 0`, `topZ = length`).
