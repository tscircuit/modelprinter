# Recirculating Ball Screw Nut (`ballscrewnut`)

Flanged Gothic-arch recirculating ball-screw nut with external return tube and four face-mounting holes.

## Example Model String

```text
ballscrewnut_bore16mm_pitch5mm_od28mm_l40mm_flangeod48mm_gothicarch_righthand_externaltube_face4hole_pcd38mm_holed5mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `bore<length>` | `boreDiameter` | `16 mm` | Nominal screw raceway bore |
| `pitch<length>` | `pitch` | `5 mm` | Ball raceway pitch |
| `od<length>` | `outerDiameter` | `28 mm` | Cylindrical nut body OD |
| `l<length>` | `length` | `40 mm` | Overall nut length |
| `flangeod<length>` | `flangeOuterDiameter` | `48 mm` | Mounting flange OD |
| `gothicarch` | `gothicArch` | `true` | Value-free Gothic-arch raceway flag |
| `righthand` / `lefthand` | `handedness` | `"right"` | Helix handedness |
| `externaltube` | `externalTube` | `true` | Value-free external return tube flag |
| `face4hole` | `face4Hole` | `true` | Value-free 4-hole flange mount flag |
| `pcd<length>` | `pcd` | `38 mm` | Bolt circle diameter |
| `holed<length>` | `holeDiameter` | `5 mm` | Flange hole diameter |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Front flange mounting plane (`bottomZ = 0`, `topZ = length`).
