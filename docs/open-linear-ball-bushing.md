# Open Linear Ball Bushing (`openlinearballbushing`)

Open tubular recirculating linear ball bushing with a longitudinal clearance slot for supported-rail shafts.

## Example Model String

```text
openlinearballbushing_id16mm_od26mm_l36mm_openrecirculating_openingangle60deg_circlipgrooves2
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `id<length>` | `innerDiameter` | `16 mm` | Shaft bore diameter |
| `od<length>` | `outerDiameter` | `26 mm` | Sleeve outer diameter |
| `l<length>` | `length` | `36 mm` | Axial length |
| `openrecirculating` | `openRecirculating` | `true` | Value-free open recirculating style flag |
| `openingangle<deg>` | `openingAngle` | `60 deg` | Longitudinal support-slot included angle |
| `circlipgrooves<int>` | `circlipGrooves` | `2` | Retaining circlip groove count (`0..2`) |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Shaft bore axis on lower end face (`bottomZ = 0`, `topZ = length`).
