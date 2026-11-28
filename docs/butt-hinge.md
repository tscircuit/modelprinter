# `butthinge`

Equal-leaf rectangular butt hinge with alternating knuckles and fixing holes, modeled flat in the 180-degree open position (roadmap item `0091`).

## Canonical Model String

```text
butthinge_w40mm_l50mm_t2mm_pin4mm_knuckles5_holes6_hole4mm_hp(24mm,18mm)_equalleaf_open180deg
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `w<len>` | `openWidth` | `40` | Full open span across both leaves along `X` (mm) |
| `l<len>` | `length` | `50` | Barrel and leaf length along `Y` (mm) |
| `t<len>` | `leafThickness` | `2` | Leaf stock thickness (mm) |
| `pin<len>` | `pinDiameter` | `4` | Central hinge pin diameter (mm) |
| `knuckles<int>` | `knuckles` | `5` | Odd alternating knuckle count (`3..11`) |
| `holes4` / `holes6` / `holes8` | `holes` | `6` | Total fixing holes across both leaves |
| `hole<len>` | `holeDiameter` | `4` | Fixing screw hole diameter (mm) |
| `hp(<x>,<y>)` | `holePitchX`, `holePitchY` | `24`, `18` | Cross-barrel and along-leaf hole pitches (mm) |
| `equalleaf` | `equalLeaf` | `true` | Two equal-width leaves flag |
| `open180deg` | `openAngle` | `180` | Flat 180-degree open pose |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on `(X, Y)` at the rear mounting plane (`bottomZ = 0`), with the knuckle barrel crown at `topZ = pinDiameter + 2 * leafThickness`.
- **Validation**: Enforces odd knuckle count and screw hole clearance from both the central barrel and leaf edges while rejecting legacy `leaf(...)` selectors.
