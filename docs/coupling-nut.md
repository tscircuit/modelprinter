# Coupling nut parameter contract

```text
couplingnut_din6334_m6_l18mm_af10mm
```

`couplingnut_m6` defaults to DIN 6334 elongated hexagon coupling nuts (`m = 3d`)
with a continuous right-hand ISO metric coarse through-thread (`6H`). The
value-free `din6334` flag restates the selection; legacy `standard(...)`
selectors are rejected.

| Size | Coarse pitch | Length (`3d`) | Across flats (`s`) | Bore-mouth diameter |
| --- | --- | --- | --- | --- |
| M6 | 1 | 18 | 10 | 6.48 |
| M8 | 1.25 | 24 | 13 | 8.64 |
| M10 | 1.5 | 30 | 17 | 10.8 |
| M12 | 1.75 | 36 | 19 | 12.96 |
| M16 | 2 | 48 | 24 | 17.28 |
| M20 | 2.5 | 60 | 30 | 21.6 |

`l`/`length`, `af`/`acrossflats`, and `threadpitch` may optionally restate the
tabulated envelope for the selected size (including unit conversions); values
that contradict `couplingNutDimensions` fail validation. `righthanded` and
`threadclass(6H)` are fixed defaults, and `threads`/`nothreads` toggle
`showThreads` (default `true`).

The lower bearing face lies at `Z=0`, centered on the Z axis, extending to
`Z=length` with two hexagon flats parallel to `XZ` (`Y = ±acrossFlats/2`),
30-degree conical outer end chamfers, and 90-degree conical bore entrances.
`getCouplingNutDimensions` resolves these untoleranced dimensions in mm.
Geometry generation belongs in `jscad-electronics`.
