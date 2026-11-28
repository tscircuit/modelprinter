# Oval Flange Bearing (`ovalflangebearing`)

Two-bolt oval flange bearing unit (UCFL style) with a self-aligning insert bore and projecting shaft hub.

## Example Model String

```text
ovalflangebearing_bore20mm_l100mm_w45mm_depth35mm_face2hole_holepitch80mm_holed10mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `bore<length>` | `boreDiameter` | `20 mm` | Shaft insert bore diameter |
| `l<length>` | `length` | `100 mm` | Major oval flange length |
| `w<length>` | `width` | `45 mm` | Minor central housing width |
| `depth<length>` | `depth` | `35 mm` | Overall axial projection |
| `face2hole` | `face2Hole` | `true` | Value-free two-bolt flange flag |
| `holepitch<length>` | `holePitch` | `80 mm` | Mounting bolt spacing |
| `holed<length>` | `holeDiameter` | `10 mm` | Mounting bolt hole diameter |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Bore axis on the rear flange mounting plane (`bottomZ = 0`, `topZ = depth`).
