# Idler pulley parameter contract

```text
idlerpulley_od30mm_bore8mm_w12mm_smoothflanged_flangeod34mm_bearingbore8mm
```

`idlerpulley` defines a smooth cylindrical belt-guiding roller along `+Z` with
two symmetric side flanges and a central bearing/shaft through-bore. The
value-free `smoothflanged` flag restates the default roller geometry; legacy
`style(...)` selectors are rejected.

## Local frame and defaults

- Lower flange face lies at `Z=0` and upper flange face lies at `Z=width`
  (`12 mm`), with fixed `0.125 * width` (`1.5 mm`) flange thickness on each side
  and `0.75 * width` (`9 mm`) smooth running track width.
- Default diameters are `outerDiameter = 30 mm`, `flangeDiameter = 34 mm`,
  `boreDiameter = 8 mm`, and `bearingBoreDiameter = 8 mm`.
- Validation enforces `flangeDiameter > outerDiameter` and
  `boreDiameter <= bearingBoreDiameter < outerDiameter`.

`getIdlerPulleyDimensions` resolves flange thickness, belt track width, radial
flange lip height, and rim wall thickness in millimeters. Geometry generation
belongs in `jscad-electronics`.
