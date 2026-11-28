# `terminalblock`

Through-hole PCB screw terminal block with upward clamp screws, front wire entries, and downward vertical solder tails (roadmap item `0121`).

## Canonical Model String

```text
terminalblock_p5mm_n4_w20mm_d10mm_h12mm_wireid2.5mm_screwm2.5_throughhole_tails4mm
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `p<len>` | `pitch` | `5` | Center-to-center terminal pitch along `X` (mm) |
| `n<int>` | `positions` | required | Number of screw terminal poles (`1..36`) |
| `w<len>` | `width` | `positions * pitch` | Overall housing width along `X` (mm) |
| `d<len>` | `depth` | `10` | Housing depth along `Y` (mm) |
| `h<len>` | `height` | `12` | Housing height above PCB seat `Z = 0` (mm) |
| `wireid<len>` | `wireEntryDiameter` | `2.5` | Front wire-entry bore diameter (mm) |
| `screwm<size>` | `screwThread` | `"m2.5"` | Metric clamp screw designation (e.g. `m2`, `m2.5`, `m3`) |
| `throughhole` / `tht` | `throughHole` | `true` | Through-hole PCB solder-tail mounting flag |
| `tails<len>` | `tailLength` | `4` | Downward solder-tail projection below `Z = 0` (mm) |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered across the pin row in `X` and housing depth in `Y` on the PCB seating plane (`seatZ = 0`), with front wire entries facing `-Y`, upward clamp screws at `topZ = height`, and solder tails extending to `bottomZ = -tailLength`.
- **Validation**: Ensures housing width encloses all wire entries across `positions * pitch`, verifies wire entry and screw diameters fit within cell pitch, and rejects legacy `mount(...)` selectors.
