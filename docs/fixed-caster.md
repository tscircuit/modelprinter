# Fixed caster parameter contract

```text
fixedcaster_wheeld50mm_wheelw20mm_platew50mm_plateh50mm_plate4hole_holegrid(35mm,35mm)_holed6mm
```

`fixedcaster` defines a non-swiveling rigid-fork caster rolling along `X` with a
drilled four-hole rectangular top mounting plate (`plateWidth × plateHeight`)
and a centered wheel (`wheelDiameter`, `wheelWidth`) on a transverse `Y` axle.
Value-free `plate4hole` replaces legacy `mount(...)` selectors.

## Local frame and defaults

- Floor contact tangent lies at `Z=0`, wheel axle center lies at
  `Z = wheelDiameter / 2` (`25 mm`), and top mounting plate upper face lies at
  `Z = overallHeight` (`59 mm` for default `50 mm` wheel).
- Four mounting holes (`holeDiameter = 6 mm`) sit at `(±gridX / 2, ±gridY / 2)`
  with default `holeGrid = [35, 35]` mm inside the `50 × 50 mm` top plate.

`getFixedCasterDimensions` resolves overall height, plate thickness, crown
clearance, and mounting hole coordinates in millimeters. Geometry generation
belongs in `jscad-electronics`.
