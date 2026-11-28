# `snapbox`

Snap-fit electronics enclosure with a recessed flat top lid and four cantilevered snap hooks on opposite walls (roadmap item `0072`).

## Canonical Model String

```text
snapbox_w80mm_d50mm_h25mm_wall2mm_corner2mm_lidt2mm_hooks4_hookw8mm_hookd1mm_lap2mm
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `w<len>` | `width` | `80` | Exterior width along `X` (mm) |
| `d<len>` | `depth` | `50` | Exterior depth along `Y` (mm) |
| `h<len>` | `height` | `25` | Overall closed enclosure height along `Z` (mm) |
| `wall<len>` | `wallThickness` | `2` | Side/floor wall thickness (mm) |
| `corner<len>` | `cornerRadius` | `2` | Exterior vertical corner radius (mm) |
| `lidt<len>` | `lidThickness` | `2` | Recessed flat lid thickness (mm) |
| `hooks4` | `hooks` | `4` | Four snap-fit retention hooks |
| `hookw<len>` | `hookWidth` | `8` | Individual snap hook width (mm) |
| `hookd<len>` | `hookDepth` | `1` | Snap barb undercut depth (mm) |
| `lap<len>` | `recessLap` | `2` | Lid recess step depth below upper rim (mm) |
| `snaplid` | `snapLid` | `true` | Snap-fit lid flag |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on `(X, Y)` at the exterior floor (`bottomZ = 0`), with recessed lid underside at `lidSeatZ = height - lidThickness` and top rim at `topZ = height`.
- **Validation**: Ensures snap hooks fit within the flat interior wall spans and undercut depth does not pierce the outer wall.
