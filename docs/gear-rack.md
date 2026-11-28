# Gear rack parameter contract

```text
gearrack_module2mm_l200mm_w15mm_h15mm_pa20deg_base2hole_holed5mm_holepitch160mm
```

`gearrack` defines a straight `20`-degree-pressure-angle involute rack bar along
`X` (`length`) with face width `width` along `Y`, overall height `height` along
`+Z`, and two centered vertical base mounting holes at `(±holePitch / 2, 0)`.
Value-free `base2hole` replaces legacy `mount(...)` selectors.

## Local frame and defaults

- Flat mounting base lies at `Z=0`, tooth root plane lies at
  `Z = height - 2.25 * module` (`10.5 mm`), reference pitch line lies at
  `Z = height - module` (`13 mm`), and tooth tips reach `Z=height` (`15 mm`).
- Default bar spans `length = 200 mm`, `width = 15 mm`, `module = 2 mm`
  (`linearPitch = 2 * pi mm`), `holeDiameter = 5 mm`, and `holePitch = 160 mm`.

`getGearRackDimensions` resolves linear tooth pitch, addendum/dedendum planes,
full tooth count, and mounting hole coordinates in millimeters. Geometry
generation belongs in `jscad-electronics`.
