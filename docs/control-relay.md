# `controlrelay`

Octal or undecal plug-in industrial control relay envelope with circular pin array, center locating key spigot, and rectangular housing (roadmap item `0129`).

## Canonical Model String

```text
controlrelay_w22mm_d28mm_h35mm_pins8_pinod1mm_pincircle11mm_centerkey_rectangularcase
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `w<len>` | `width` | `22` | Rectangular housing width along `X` (mm) |
| `d<len>` | `depth` | `28` | Rectangular housing depth along `Y` (mm) |
| `h<len>` | `height` | `35` | Housing height above socket seat `Z = 0` (mm) |
| `pins8` / `pins11` | `pins` | `8` | Circular plug-in pin count (`8` or `11`) |
| `pinod<len>` | `pinDiameter` | `1` | Individual round pin diameter (mm) |
| `pincircle<len>` | `pinCircleDiameter` | `11` | Pin pitch-circle diameter (mm) |
| `centerkey` | `centerKey` | `true` | Center keyed locating spigot flag |
| `rectangularcase` / `rectangular` | `rectangularCase` | `true` | Rectangular relay cover flag |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on the pin circle `(X, Y)` at the relay base seating plane (`seatZ = 0`), with the housing extending to `topZ = height` and plug-in pins projecting to `bottomPinTipZ = -pinLength`.
- **Validation**: Ensures the pin circle fits inside `min(width, depth)` and maintains inter-pin chord clearance while rejecting legacy `key(...)` and `case(...)` selectors.
