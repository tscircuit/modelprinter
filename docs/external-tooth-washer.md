# `externaltoothwasher`

Annular external-tooth lock washer with a flat central ring and radially projecting twisted teeth (roadmap item `0039`).

## Canonical Model String

```text
externaltoothwasher_custom_id6.4mm_bodyod9mm_od12mm_h0.8mm_teeth12_toothw1.2mm_twist15deg
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Explicit custom dimensional specification flag |
| `id<len>` | `innerDiameter` | required | Central bore diameter (mm) |
| `bodyod<len>` | `bodyOuterDiameter` | required | Flat central ring outer diameter (mm) |
| `od<len>` | `outerDiameter` | required | Overall tooth-tip circle diameter (mm) |
| `h<len>` / `t<len>` | `thickness` | required | Stock sheet thickness of the central ring (mm) |
| `teeth<int>` | `teeth` | `12` | Number of equally spaced outward radial teeth (`3..64`) |
| `toothw<len>` | `toothWidth` | required | Circumferential width of each tooth at its root (mm) |
| `twist<deg>` | `twistAngle` | `15` | Out-of-plane twist angle of each radial tooth (`0 < angle < 90` deg) |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on the bore axis at the lower axial envelope plane (`bottomZ = 0`).
- **Axis**: `+Z` points along the washer bore axis up to `topZ = envelopeHeight`.
- **Validation**: Enforces `innerDiameter < bodyOuterDiameter < outerDiameter` and `teeth * toothWidth < Math.PI * bodyOuterDiameter` while rejecting parenthesized legacy selectors such as `spec(custom)` or `twist(15deg)`.
