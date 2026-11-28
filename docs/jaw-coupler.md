# Jaw coupler parameter contract

```text
jawcoupler_bore8mm_od30mm_l40mm_jaws3_curvedjaw_setscrew_m4
```

`jawcoupler` defines an assembled curved-jaw shaft coupling along `+Z` composed
of two `jawCount`-jaw hubs (`boreDiameter`, optional `boreBDiameter`,
`outerDiameter`), an interlocking `2 * jawCount`-lobe elastomer spider, and one
radial right-hand ISO metric coarse (`6H`) set-screw bore per hub (`metricSize`).
Value-free `curvedjaw` and `setscrew` flags replace legacy `style(...)` and
`mount(...)` selectors.

## Local frame and defaults

- Assembled coupling extends from `Z=0` to `Z=length` (`40 mm`) with default
  `outerDiameter = 30 mm`, `boreDiameter = boreBDiameter = 8 mm`,
  `jawCount = 3` (`6`-lobe spider), and `M4` radial set screws.

`getJawCouplerDimensions` resolves spider lobe count, hub/spider axial split,
and radial set-screw `Z` planes in millimeters. Geometry generation belongs in
`jscad-electronics`.
