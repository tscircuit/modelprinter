# `drawlatch`

Over-center lever and wire-bail draw latch assembly with a separate hooked keeper and pierced mounting bases in the closed latched state (roadmap item `0097`).

## Canonical Model String

```text
drawlatch_w20mm_l60mm_h15mm_t2mm_loopwire2mm_catchw18mm_hole4mm_hp(12mm,35mm)_overcenter
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `w<len>` | `width` | `20` | Overall mounting base and lever width along `X` (mm) |
| `l<len>` | `length` | `60` | Closed assembly span across body and keeper along `Y` (mm) |
| `h<len>` | `height` | `15` | Closed over-center lever height above mounting surface (mm) |
| `t<len>` | `sheetThickness` | `2` | Stamped base and lever stock thickness (mm) |
| `loopwire<len>` | `loopWireDiameter` | `2` | Bail wire diameter (mm) |
| `catchw<len>` | `catchWidth` | `18` | Hooked keeper catch width along `X` (mm) |
| `hole<len>` | `holeDiameter` | `4` | Base mounting screw hole diameter (mm) |
| `hp(<x>,<y>)` | `holePitchX`, `holePitchY` | `12`, `35` | Lateral and longitudinal mounting hole pitches (mm) |
| `overcenter` | `overCenter` | `true` | Over-center toggle bail latch flag |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on the closed latch footprint `(X, Y)` on the enclosure mounting surface (`bottomZ = 0`), rising to `topZ = height`.
- **Validation**: Ensures `catchWidth <= width`, mounting hole pitches fit inside `width` and `length`, and rejects legacy `type(...)` selectors.
