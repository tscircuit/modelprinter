# DIN Rail Relay Base (`relaybase`)

Circular octal/undecal relay socket in a rectangular TH35x7.5 DIN-rail base with stepped side screw terminal wells.

## Example Model String

```text
relaybase_w25mm_d40mm_h20mm_socketpins8_socketpcd11mm_th35x7.5_sidescrewterminals_screwm3
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `w<length>` | `width` | `25 mm` | Base module width along DIN rail |
| `d<length>` | `depth` | `40 mm` | Base front-to-back depth across DIN rail |
| `h<length>` | `height` | `20 mm` | Overall base height |
| `socketpins<count>` | `socketPins` | `8` | Circular socket contact count (`8` or `11`) |
| `socketpcd<length>` | `socketPcd` | `11 mm` | Socket contact pin circle diameter |
| `th35x7.5` | `th35x75` | `true` | Value-free TH35x7.5 DIN rail clip flag |
| `sidescrewterminals` | `sideScrewTerminals` | `true` | Value-free stepped side screw terminal flag |
| `screwm<size>` | `screwThread` | `"m3"` | Terminal screw thread |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Center of the rear DIN-rail mounting face (`bottomZ = 0`, `topZ = height`).
