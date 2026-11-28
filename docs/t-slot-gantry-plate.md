# T-slot gantry plate parameter contract

```text
tslotgantryplate_w100mm_h80mm_thickness6mm_wheelspacing60mm_vgroovewheels_axleholes4_holed5mm_eccentricd7mm
```

`tslotgantryplate` defines a flat rectangular carriage plate with four V-groove
wheel axle through-bores arranged on a centered `wheelSpacing × wheelSpacing`
square grid. The value-free `vgroovewheels` flag restates the wheel mounting
interface; legacy `mount(...)` selectors are rejected.

## Local frame and hole layout

- Bottom plate face lies at `Z=0` and top face lies at `Z=thickness` (`6 mm`).
- Rectangular envelope spans `[-width / 2, width / 2]` (`100 mm`) in `X` and
  `[-height / 2, height / 2]` (`80 mm`) in `Y`.
- Two fixed-axle holes (`holeDiameter = 5 mm`) sit at
  `(±wheelSpacing / 2, +wheelSpacing / 2)`, and two larger eccentric-spacer
  bores (`eccentricDiameter = 7 mm`) sit at
  `(±wheelSpacing / 2, -wheelSpacing / 2)`.
- Validation enforces `eccentricDiameter > holeDiameter`,
  `wheelSpacing > eccentricDiameter`, and positive plate edge margins around
  every bore.

`getTSlotGantryPlateDimensions` resolves fixed and eccentric bore centers and
minimum side/edge margins in millimeters. Geometry generation belongs in
`jscad-electronics`.
