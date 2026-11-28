# Linear Carriage (`linearcarriage`)

Pinned HGH15CA narrow square carriage block matched to the HGR15 profile rail, with four M4 x 5 top tapped mounting holes on a 26 mm grid.

## Example Model String

```text
linearcarriage_hgh15ca_railhgr15_w34mm_l61.4mm_assemblyh28mm_holegrid(26mm,26mm)_tappedholes_m4_threaddepth5mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `hgh15ca` | `hgh15ca` | `true` | Value-free HGH15CA block series flag |
| `railhgr15` | `railHgr15` | `true` | Value-free mating HGR15 rail flag |
| `w<length>` | `width` | `34 mm` | Pinned HGH15CA carriage width |
| `l<length>` | `length` | `61.4 mm` | Pinned HGH15CA overall length |
| `assemblyh<length>` | `assemblyHeight` | `28 mm` | Assembled height from rail base to carriage top |
| `holegrid(x,y)` | `holeGridX`, `holeGridY` | `26 mm`, `26 mm` | Square top tapped hole grid |
| `tappedholes` | `tappedHoles` | `true` | Value-free tapped top holes flag |
| `m4` | `thread` | `"m4"` | Pinned M4 top mounting thread |
| `threaddepth<length>` | `threadDepth` | `5 mm` | Tapped blind hole depth |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Rail base datum centerline (`topZ = assemblyHeight = 28 mm`).
