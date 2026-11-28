# Split Shaft Collar (`splitshaftcollar`)

Two-piece split clamping shaft collar with two opposed tangential clamp bolt bores (roadmap #13, item 0315).

## Example Model String

```text
splitshaftcollar_bore20mm_od40mm_w12mm_twopiececlamp_bolts2_m5
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `bore<length>` | `boreDiameter` | `20 mm` | Central shaft bore |
| `od<length>` | `outerDiameter` | `40 mm` | Collar outer diameter |
| `w<length>`, `width<length>` | `width` | `12 mm` | Collar axial width |
| `twopiececlamp` | `twoPieceClamp` | `true` | Value-free two-piece clamp flag |
| `bolts2` | `bolts` | `2` | Opposed tangential clamp bolts |
| `m<size>` | `thread` | `"m5"` | Clamp bolt nominal metric thread |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Lower face center (`bottomZ = 0`, `topZ = width`).
