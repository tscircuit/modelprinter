# `hitchpin`

Bent-handle hitch pin with a straight working shank, transverse retaining cross-hole near the tip, and chamfered insertion end (roadmap item `0103`).

## Canonical Model String

```text
hitchpin_custom_d6mm_l40mm_benthead_handlel20mm_bendr6mm_hole2mm_holeoffset5mm_chamfertip_chamfer0.5mm
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Custom dimensional specification flag |
| `d<len>` | `diameter` | required | Straight shank diameter (mm) |
| `l<len>` | `workingLength` | required | Straight working shank length from bend tangent to tip (mm) |
| `benthead` / `bent` | `bentHead` | `true` | 90-degree bent grip handle flag |
| `handlel<len>` | `handleLength` | required | Straight grip leg length after the bend (mm) |
| `bendr<len>` | `bendRadius` | required | Handle centerline bend radius (mm) |
| `hole<len>` | `crossHoleDiameter` | required | Transverse clip cross-hole diameter (mm) |
| `holeoffset<len>` | `crossHoleOffset` | required | Distance from tip end to cross-hole axis (mm) |
| `chamfertip` | `chamferTip` | `true` | Chamfered insertion tip flag |
| `chamfer<len>` | `tipChamfer` | `0.5` | Axial/radial tip chamfer size (mm) |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on the shank axis at the start of the handle bend (`bendStartZ = 0`), with the working shank extending to `tipZ = -workingLength` and the bent handle extending along `+X`.
- **Validation**: Ensures cross-hole clearance from both the tip chamfer and bend tangent, enforces `crossHoleDiameter < 0.75 * diameter`, and rejects parenthesized legacy selectors (`spec(...)`, `head(...)`, `tip(...)`).
