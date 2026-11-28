# Lead Screw Nut (`leadscrewnut`)

Flanged cylindrical trapezoidal lead-screw nut with four face-mounting clearance holes.

## Example Model String

```text
leadscrewnut_bore8mm_od16mm_l15mm_flangeod26mm_tr8_threadpitch2mm_lead2mm_starts1_face4hole_pcd20mm_holed3mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `bore<length>` | `boreDiameter` | `8 mm` | Nominal trapezoidal bore diameter |
| `od<length>` | `bodyOuterDiameter` | `16 mm` | Cylindrical barrel OD |
| `l<length>` | `length` | `15 mm` | Overall axial nut length |
| `flangeod<length>` | `flangeOuterDiameter` | `26 mm` | Mounting flange outer diameter |
| `tr<size>` | `trapezoidalThread` | `"tr8"` | ISO trapezoidal thread designation |
| `threadpitch<length>` | `threadPitch` | `2 mm` | Axial thread pitch |
| `lead<length>` | `lead` | `2 mm` | Axial advance per revolution |
| `starts<int>` | `starts` | `1` | Thread start count |
| `face4hole` | `face4Hole` | `true` | Value-free four-hole flange mounting flag |
| `pcd<length>` | `pitchCircleDiameter` | `20 mm` | Mounting bolt-circle diameter |
| `holed<length>` | `holeDiameter` | `3 mm` | Clearance mounting hole diameter |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Bore axis on the lower flange mounting face (`bottomZ = 0`, `topZ = length`).
