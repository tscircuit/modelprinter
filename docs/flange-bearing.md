# `flangebearing`

Square four-bolt flange bearing housing (`UCF`-style) with a self-aligning insert and projecting shaft collar hub (roadmap item `0047`).

## Canonical Model String

```text
flangebearing_bore20mm_w86mm_h86mm_depth35mm_face4hole_holegrid(64mm,64mm)_holed10mm
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `bore<len>` | `boreDiameter` | `20` | Shaft bore diameter (mm) |
| `w<len>` | `width` | `86` | Flange width along `X` (mm) |
| `h<len>` | `height` | `86` | Flange height along `Y` (mm) |
| `depth<len>` | `depth` | `35` | Overall axial depth along `Z` (mm) |
| `face4hole` | `face4Hole` | `true` | Four-hole square face-mount flag |
| `holegrid(<x>,<y>)` | `holeGridX`, `holeGridY` | `64`, `64` | Four-bolt grid pitches (mm) |
| `holed<len>` | `holeDiameter` | `10` | Flange bolt hole diameter (mm) |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on the shaft bore `(X, Y)` at the rear mounting face (`bottomZ = 0`), projecting along `+Z` to `topZ = depth`.
- **Validation**: Ensures the four mounting holes stay inside the square flange and clear the shaft bore while rejecting legacy `mount(...)` selectors.
