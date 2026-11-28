# `flangebox`

Rectangular enclosure with full-depth end mounting flanges and a four-screw flat cover lid (roadmap item `0067`).

## Canonical Model String

```text
flangebox_w120mm_d80mm_h45mm_wall2mm_flange12mm_flanget3mm_holes4_hole4mm_hp(136mm,56mm)_screwonlid_screws4
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `w<len>` | `width` | `120` | Main box exterior body width along `X` (mm) |
| `d<len>` | `depth` | `80` | Box exterior depth along `Y` (mm) |
| `h<len>` | `height` | `45` | Overall closed box height along `Z` (mm) |
| `wall<len>` | `wallThickness` | `2` | Side/floor/lid wall thickness (mm) |
| `flange<len>` | `flangeProjection` | `12` | Outward projection of each end flange along `+/-X` (mm) |
| `flanget<len>` | `flangeThickness` | `3` | Base mounting flange thickness along `Z` (mm) |
| `holes4` | `flangeHoles` | `4` | Total mounting holes across both end flanges |
| `hole<len>` | `flangeHoleDiameter` | `4` | Flange mounting hole diameter (mm) |
| `hp(<x>,<y>)` | `holePitchX`, `holePitchY` | `136`, `56` | Flange mounting hole grid pitches (mm) |
| `screwonlid` / `screwon` | `screwOnLid` | `true` | Flat screw-fastened lid flag |
| `screws4` | `lidScrews` | `4` | Four corner lid screws |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on the enclosure footprint `(X, Y)` at the mounting base plane (`bottomZ = 0`), rising to `topZ = height`.
- **Validation**: Ensures mounting holes lie on the outward end flanges (`width + holeDiameter < holePitchX < width + 2 * flangeProjection - holeDiameter`) while rejecting legacy `lid(...)` selectors.
