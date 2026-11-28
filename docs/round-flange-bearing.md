# Round Flange Bearing (`roundflangebearing`)

Circular four-hole flange bearing housing (UCFC style) with bolts on a concentric pitch circle.

## Example Model String

```text
roundflangebearing_bore20mm_od90mm_depth35mm_pcd70mm_face4hole_holed8mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `bore<length>` | `boreDiameter` | `20 mm` | Shaft insert bore diameter |
| `od<length>` | `outerDiameter` | `90 mm` | Circular flange outer diameter |
| `depth<length>` | `depth` | `35 mm` | Overall axial projection |
| `pcd<length>` | `pitchCircleDiameter` | `70 mm` | Four-bolt pitch circle diameter |
| `face4hole` | `face4Hole` | `true` | Value-free four-bolt face mount flag |
| `holed<length>` | `holeDiameter` | `8 mm` | Bolt clearance hole diameter |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Bore axis on the rear flange mounting face (`bottomZ = 0`, `topZ = depth`).
