# Anti-Backlash Lead Screw Nut (`antibacklashnut`)

Spring-preloaded two-piece trapezoidal lead screw nut assembly with a two-hole mounting flange.

## Example Model String

```text
antibacklashnut_bore8mm_od20mm_l30mm_tr8_threadpitch2mm_lead2mm_starts1_face2hole_flangeod32mm_pcd26mm_holed3mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `bore<length>` | `boreDiameter` | `8 mm` | Nominal trapezoidal bore diameter |
| `od<length>` | `outerDiameter` | `20 mm` | Nut barrel outer diameter |
| `l<length>` | `length` | `30 mm` | Overall assembled axial length |
| `tr<size>` | `trapezoidalThread` | `"tr8"` | Trapezoidal thread designation |
| `threadpitch<length>` | `threadPitch` | `2 mm` | Axial thread pitch |
| `lead<length>` | `lead` | `2 mm` | Axial travel per turn |
| `starts<count>` | `starts` | `1` | Number of thread starts |
| `face2hole` | `face2Hole` | `true` | Value-free 2-hole flange mount flag |
| `flangeod<length>` | `flangeOuterDiameter` | `32 mm` | Mounting flange outer diameter |
| `pcd<length>` | `pcd` | `26 mm` | Flange hole pitch circle diameter |
| `holed<length>` | `holeDiameter` | `3 mm` | Flange clearance hole diameter |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Mounting flange reference plane (`bottomZ = 0`, `topZ = length`).
