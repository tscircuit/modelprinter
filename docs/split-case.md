# `splitcase`

Clamshell two-piece split enclosure with a stepped overlapping parting seam and four corner assembly screws (roadmap item `0065`).

## Canonical Model String

```text
splitcase_w100mm_d60mm_h28mm_wall2mm_corner3mm_split14mm_seamlap2mm_screwonlid_screws4_hole3mm_hp(86mm,46mm)
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `w<len>` | `width` | `100` | Exterior width along `X` (mm) |
| `d<len>` | `depth` | `60` | Exterior depth along `Y` (mm) |
| `h<len>` | `height` | `28` | Closed two-shell height along `Z` (mm) |
| `wall<len>` | `wallThickness` | `2` | Shell wall thickness (mm) |
| `corner<len>` | `cornerRadius` | `3` | Exterior vertical corner radius (mm) |
| `split<len>` | `splitHeight` | `14` | Lower shell height to parting plane `seamZ` (mm) |
| `seamlap<len>` | `seamLap` | `2` | Stepped axial overlap height across parting seam (mm) |
| `screwonlid` / `screwon` | `screwOnLid` | `true` | Screw-fastened upper shell flag |
| `screws4` | `screws` | `4` | Four corner assembly screws |
| `hole<len>` | `screwHoleDiameter` | `3` | Screw clearance hole diameter (mm) |
| `hp(<x>,<y>)` | `holePitchX`, `holePitchY` | `86`, `46` | Corner screw pattern pitches (mm) |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on `(X, Y)` at the lower shell base (`bottomZ = 0`), with parting plane at `seamZ = splitHeight` and top face at `topZ = height`.
- **Validation**: Ensures parting seam and lap step stay clear of both shell floors and corner screw bores fit inside the interior cavity while rejecting legacy `lid(...)` selectors.
