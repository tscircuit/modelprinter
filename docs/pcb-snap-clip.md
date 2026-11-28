# `pcbsnapclip`

Snap-in circuit board standoff support with a split-arrow top retention latch and a screw-mounted round base flange (roadmap item `0076`).

## Canonical Model String

```text
pcbsnapclip_h10mm_base8mm_stem3mm_board1.6mm_barb4mm_splitarrow_screwfoot_screw3mm
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `h<len>` | `standoffHeight` | `10` | Board underside standoff height above chassis seat (mm) |
| `base<len>` | `baseOuterDiameter` | `8` | Flat round mounting foot outside diameter (mm) |
| `stem<len>` | `stemDiameter` | `3` | Support post and PCB hole neck diameter (mm) |
| `board<len>` | `boardThickness` | `1.6` | Captured PCB thickness between shoulder and barb (mm) |
| `barb<len>` | `barbOuterDiameter` | `4` | Split-arrow retention barb outside diameter (mm) |
| `splitarrow` | `splitArrow` | `true` | Split-arrow top snap latch flag |
| `screwfoot` | `screwFoot` | `true` | Screw-fastened base foot flag |
| `screw<len>` | `screwDiameter` | `3` | Base mounting screw clearance bore diameter (mm) |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on the post axis on the chassis mounting face (`bottomZ = 0`), with the PCB underside resting at `boardSeatZ = standoffHeight` and the latch tip at `topZ = overallHeight`.
- **Validation**: Ensures `stemDiameter < barbOuterDiameter`, `stemDiameter < baseOuterDiameter`, and screw bore containment inside the base flange while rejecting legacy `latch(...)` and `foot(...)` selectors.
