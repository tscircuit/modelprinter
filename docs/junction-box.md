# `junctionbox`

Electrical screw-lid junction enclosure with rounded exterior corners and centered conduit knockouts on all four vertical walls (roadmap item `0069`).

## Canonical Model String

```text
junctionbox_w100mm_d100mm_h60mm_wall3mm_corner3mm_knockouts(20mm,20mm,20mm,20mm)_screwonlid_screws4_hp(84mm,84mm)
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `w<len>` | `width` | `100` | Exterior width along `X` (mm) |
| `d<len>` | `depth` | `100` | Exterior depth along `Y` (mm) |
| `h<len>` | `height` | `60` | Overall closed enclosure height along `Z` (mm) |
| `wall<len>` | `wallThickness` | `3` | Side/floor/lid wall thickness (mm) |
| `corner<len>` | `cornerRadius` | `3` | Exterior vertical corner radius (mm) |
| `knockouts(<f>,<r>,<b>,<l>)` / `knockout<d>` | `frontKnockoutDiameter`..`leftKnockoutDiameter` | `20` | Centered side-wall knockout diameters (mm) |
| `screwonlid` / `screwon` | `screwOnLid` | `true` | Screw-fastened cover lid flag |
| `screws4` | `lidScrews` | `4` | Four corner lid screws |
| `hp(<x>,<y>)` | `holePitchX`, `holePitchY` | `84`, `84` | Lid screw pattern pitches (mm) |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on `(X, Y)` at the exterior floor (`bottomZ = 0`), rising to `topZ = height`.
- **Validation**: Ensures all four conduit knockouts fit inside their flat wall faces and lid screw centers stay inside the interior wall perimeter while rejecting legacy `lid(...)` selectors.
