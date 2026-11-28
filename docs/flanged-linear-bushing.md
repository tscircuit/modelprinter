# Flanged Linear Bushing (`flangedlinearbushing`)

Closed recirculating linear ball bushing (LMF12UU style) with a round four-hole face mounting flange.

## Example Model String

```text
flangedlinearbushing_id12mm_od21mm_l30mm_flangeod42mm_closedrecirculating_round4hole_pcd32mm_holed4mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `id<length>` | `innerDiameter` | `12 mm` | Shaft bore diameter |
| `od<length>` | `outerDiameter` | `21 mm` | Cylindrical sleeve OD |
| `l<length>` | `length` | `30 mm` | Overall axial length |
| `flangeod<length>` | `flangeOuterDiameter` | `42 mm` | Circular flange OD |
| `closedrecirculating` | `closedRecirculating` | `true` | Value-free closed ball bushing flag |
| `round4hole` | `round4Hole` | `true` | Value-free round 4-hole flange flag |
| `pcd<length>` | `pitchCircleDiameter` | `32 mm` | Bolt circle diameter |
| `holed<length>` | `holeDiameter` | `4 mm` | Flange bolt hole diameter |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Bore axis on the lower flange face (`bottomZ = 0`, `topZ = length`).
