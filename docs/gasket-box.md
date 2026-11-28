# `gasketbox`

Sealed screw-lid enclosure with rounded exterior corners and a continuous perimeter elastomer sealing groove inside its upper rim (roadmap item `0073`).

## Canonical Model String

```text
gasketbox_w120mm_d80mm_h55mm_wall3mm_corner4mm_lidt3mm_groovew3mm_grooved2mm_screws4_hp(104mm,64mm)
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `w<len>` | `width` | `120` | Exterior width along `X` (mm) |
| `d<len>` | `depth` | `80` | Exterior depth along `Y` (mm) |
| `h<len>` | `height` | `55` | Overall closed enclosure height along `Z` (mm) |
| `wall<len>` | `wallThickness` | `3` | Exterior side/floor wall thickness (mm) |
| `corner<len>` | `cornerRadius` | `4` | Exterior vertical corner radius (mm) |
| `lidt<len>` | `lidThickness` | `3` | Top cover lid thickness along `Z` (mm) |
| `groovew<len>` | `grooveWidth` | `3` | Perimeter gasket groove radial width (mm) |
| `grooved<len>` | `grooveDepth` | `2` | Perimeter gasket groove axial depth (mm) |
| `screws4` | `lidScrews` | `4` | Four corner lid screws |
| `hp(<x>,<y>)` | `holePitchX`, `holePitchY` | `104`, `64` | Lid screw pattern pitches (mm) |
| `screwonlid` / `screwon` | `screwOnLid` | `true` | Screw-fastened lid flag |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on `(X, Y)` at the exterior floor (`bottomZ = 0`), with lid parting plane at `seamZ = height - lidThickness`, groove floor at `grooveFloorZ`, and lid top at `topZ = height`.
- **Validation**: Ensures groove depth and rim thickness leave an open interior cavity and corner screws stay inside the outer walls.
