# Cap nut parameter contract

```text
capnut_din1587_m6
```

`capnut_m6` defaults to DIN 1587 high-domed hexagon cap nuts with a hexagonal
wrenching base and a closed spherical-cap dome enclosing a blind right-hand ISO
metric coarse internal thread (`6H`). The value-free `din1587` flag restates
the selection; legacy `standard(...)` selectors are rejected.

| Size | Coarse pitch | Across flats (`s`) | Total height (`h`) | Cap diameter (`dk`) | Hex height (`m`) | Thread depth (`t`) |
| --- | --- | --- | --- | --- | --- | --- |
| M4 | 0.7 | 7 | 8 | 6.5 | 3.2 | 5.26 |
| M5 | 0.8 | 8 | 10 | 7.5 | 4 | 7.21 |
| M6 | 1 | 10 | 12 | 9.5 | 5 | 7.71 |
| M8 | 1.25 | 13 | 15 | 12.5 | 6.5 | 10.65 |
| M10 | 1.5 | 16 | 18 | 15 | 8 | 12.65 |
| M12 | 1.75 | 18 | 22 | 17 | 10 | 15.65 |

`threadpitch` may optionally restate the tabulated coarse pitch; contradictory
pitches fail validation. `righthanded` and `threadclass(6H)` are fixed
defaults, and `threads`/`nothreads` toggle `showThreads` (default `true`).

The lower bearing face lies at `Z=0`, the hexagonal base rises to `Z=hexHeight`,
the closed dome apex reaches `Z=height`, and the blind internal thread extends
from the `90`-degree entrance countersink at `Z=0` to `Z=threadDepth`.
`getCapNutDimensions` resolves these untoleranced dimensions in mm. Geometry
generation belongs in `jscad-electronics`.
