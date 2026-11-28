# `circuitbreaker`

Modular DIN-rail miniature circuit breaker (MCB) envelope with a stepped front nose, front toggle actuator, top/bottom cage terminals, and rear TH35x7.5 rail recess (roadmap item `0128`).

## Canonical Model String

```text
circuitbreaker_w18mm_h85mm_d70mm_poles1_th35x7.5_fronttoggle_topbottomterminals_stepped
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `w<len>` | `width` | `poles * 18` | Overall modular width along DIN rail `X` (mm) |
| `h<len>` | `height` | `85` | Vertical breaker height along `Y` (mm) |
| `d<len>` | `depth` | `70` | Projection depth from rear rail mounting plane `+Z` (mm) |
| `poles1..poles4` | `poles` | `1` | Number of ganged poles (`1..4`) |
| `th35x7.5` | `th35x75Rail` | `true` | EN 60715 TH35-7.5 top-hat DIN rail latch flag |
| `fronttoggle` | `frontToggle` | `true` | Front toggle handle flag |
| `topbottomterminals` / `topbottom` | `topBottomTerminals` | `true` | Upper and lower screw terminal wells flag |
| `stepped` | `stepped` | `true` | Stepped 45 mm DIN Escutcheon profile flag |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered across `width` and `height` on the rear DIN-rail mounting backplane (`rearZ = 0`), with the toggle nose extending toward `frontZ = depth`.
- **Validation**: Enforces `width >= poles * 17.5`, `height > 40`, and `depth > 25` while rejecting legacy `rail(...)`, `actuator(...)`, `terminals(...)`, and `shape(...)` selectors.
