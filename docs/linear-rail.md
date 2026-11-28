# Linear Rail (`linearrail`)

Pinned HGR15 profile linear guideway rail with top-counterbored mounting holes.

## Example Model String

```text
linearrail_hgr15_w15mm_h15mm_l300mm_p60mm_firsthole30mm_holes5_hole4.5mm_counterbore7.5mm_counterboredepth5.3mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `hgr15` | `hgr15` | `true` | Value-free HGR15 profile flag |
| `w<length>` | `width` | `15 mm` | Pinned HGR15 rail width |
| `h<length>` | `height` | `15 mm` | Pinned HGR15 rail height |
| `l<length>` | `length` | `300 mm` | Overall rail length |
| `p<length>` | `pitch` | `60 mm` | Pinned HGR15 hole pitch |
| `firsthole<length>` | `firstHole` | `30 mm` | Distance from `-X` datum end to first hole |
| `holes<int>` | `holes` | `5` | Counterbored mounting hole count |
| `hole<length>` | `holeDiameter` | `4.5 mm` | Through clearance hole diameter |
| `counterbore<length>` | `counterboreDiameter` | `7.5 mm` | Top counterbore diameter |
| `counterboredepth<length>` | `counterboreDepth` | `5.3 mm` | Top counterbore depth |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Centered across width on the bottom mounting face (`bottomZ = 0`, `topZ = height`), with rail spanning `[0, length]` along `+X`.
