# Ball Screw (`ballscrew`)

Gothic-arch recirculating ball screw shaft with reduced cylindrical support journals at each end.

## Example Model String

```text
ballscrew_d16mm_l400mm_pitch5mm_gothicarch_righthand_starts1_endjournald12mm_endjournall30mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `d<length>` | `diameter` | `16 mm` | Nominal ball raceway diameter |
| `l<length>` | `length` | `400 mm` | Overall shaft length including journals |
| `pitch<length>` | `pitch` | `5 mm` | Axial raceway pitch |
| `gothicarch` | `gothicArch` | `true` | Value-free Gothic-arch raceway flag |
| `righthand` / `lefthand` | `handedness` | `"right"` | Value-free helix handedness flag |
| `starts<count>` | `starts` | `1` | Number of thread starts |
| `endjournald<length>` | `endJournalDiameter` | `12 mm` | Reduced end journal diameter |
| `endjournall<length>` | `endJournalLength` | `30 mm` | Length of each end support journal |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Center of the lower end journal face (`bottomZ = 0`, `topZ = length`).
