# Linear Ball Bushing (`linearballbushing`)

Closed cylindrical recirculating linear ball bushing with optional outer circlip retaining grooves.

## Example Model String

```text
linearballbushing_id8mm_od15mm_l24mm_closedrecirculating_circlipgrooves2
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `id<length>` | `innerDiameter` | `8 mm` | Nominal shaft bore diameter |
| `od<length>` | `outerDiameter` | `15 mm` | Outer housing diameter |
| `l<length>` | `length` | `24 mm` | Overall axial bushing length |
| `closedrecirculating` | `closedRecirculating` | `true` | Value-free closed recirculating style flag |
| `circlipgrooves<int>` | `circlipGrooves` | `2` | Retaining ring groove count (`0..2`) |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Bore axis on the lower end face (`bottomZ = 0`, `topZ = length`).
