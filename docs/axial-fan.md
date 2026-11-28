# `axialfan`

Square frame DC/AC electronics cooling axial fan with pitched impeller blades and four corner mounting holes (roadmap item `0146`).

## Canonical Model String

```text
axialfan_w40mm_h40mm_d10mm_hole3.5mm_hp(32mm,32mm)_hub16mm_blades7_cwfront_fronttorear_bladepitch25deg_flatpitched
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `w<len>` | `width` | `40` | Square fan frame width along `X` (mm) |
| `h<len>` | `height` | `40` | Square fan frame height along `Y` (mm) |
| `d<len>` | `depth` | `10` | Axial frame thickness along `Z` (mm) |
| `hole<len>` | `holeDiameter` | `3.5` | Corner mounting hole diameter (mm) |
| `hp(<x>,<y>)` | `holePitchX`, `holePitchY` | `32`, `32` | Corner mounting hole pitches (mm) |
| `hub<len>` | `hubOuterDiameter` | `16` | Central motor hub outside diameter (mm) |
| `blades<int>` | `blades` | `7` | Number of impeller blades (`3..15`) |
| `cwfront` | `cwFront` | `true` | Clockwise rotation viewed from inlet face flag |
| `fronttorear` | `frontToRear` | `true` | Airflow direction from `+Z` inlet to `-Z` exhaust flag |
| `bladepitch<deg>` | `bladePitchAngle` | `25` | Flat blade pitch angle (deg) |
| `flatpitched` | `flatPitched` | `true` | Flat pitched blade geometry flag |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on the impeller axis at mid-depth (`frontZ = depth / 2`, `rearZ = -depth / 2`).
- **Validation**: Ensures hub diameter leaves annular swept area and corner mounting holes stay inside the frame while rejecting legacy `rotation(...)`, `flow(...)`, and `bladetype(...)` selectors.
