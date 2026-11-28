# Leveling foot parameter contract

```text
levelingfoot_od30mm_padh8mm_m8_steml27mm_swivel0deg_flatbase
```

`levelingfoot` defines a rigid machine leveling foot with a flat circular base
pad and a coaxial right-hand ISO metric coarse (`6g`) external threaded stem
without an articulating swivel joint (`swivelAngle = 0`). Value-free `flatbase`
replaces legacy `base(...)` selectors.

## Local frame and defaults

- Flat floor contact face lies at `Z=0`, circular pad shoulder lies at
  `Z=padHeight` (`8 mm`, `padDiameter = 30 mm`), and the threaded stem rises
  coaxially along `+Z` to `Z = padHeight + stemLength` (`35 mm` for default
  `stemLength = 27 mm`).
- Supported stem thread designations are `M5`, `M6`, `M8` (default), `M10`,
  `M12`, and `M16`.

`getLevelingFootDimensions` resolves overall height, stem diameter, and pad
shoulder width in millimeters. Geometry generation belongs in
`jscad-electronics`.
