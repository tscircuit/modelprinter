# `hingedbox`

Rectangular control enclosure with a flush hinged lid, alternating left-side hinge barrel, and opposite right-side hook latch (roadmap item `0071`).

## Canonical Model String

```text
hingedbox_w150mm_d100mm_h70mm_wall3mm_corner4mm_lidt3mm_lefthinge_pin4mm_knuckles5_rightlatch
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `w<len>` | `width` | `150` | Box body exterior width along `X` (mm) |
| `d<len>` | `depth` | `100` | Box body exterior depth along `Y` (mm) |
| `h<len>` | `height` | `70` | Closed box and flush lid height along `Z` (mm) |
| `wall<len>` | `wallThickness` | `3` | Side/floor wall thickness (mm) |
| `corner<len>` | `cornerRadius` | `4` | Exterior vertical corner radius (mm) |
| `lidt<len>` | `lidThickness` | `3` | Flush top cover thickness along `Z` (mm) |
| `lefthinge` | `leftHinge` | `true` | Left-edge (`-X`) barrel hinge flag |
| `pin<len>` | `hingePinDiameter` | `4` | Hinge pin diameter (mm) |
| `knuckles<int>` | `knuckles` | `5` | Odd alternating knuckle count (`3..15`) |
| `rightlatch` | `rightLatch` | `true` | Right-edge (`+X`) hook keeper latch flag |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on `(X, Y)` of the main box body at the floor (`bottomZ = 0`), with lid parting plane at `seamZ = height - lidThickness` and top face at `topZ = height`.
- **Validation**: Enforces odd knuckle counts, lid thickness limits, and knuckle/pin proportion while rejecting legacy `hinge(...)` and `latch(...)` selectors.
