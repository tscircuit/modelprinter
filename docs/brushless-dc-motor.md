# Brushless DC motor parameter contract

```text
brushlessdcmotor_od42mm_l40mm_shaftd5mm_boltpcd30mm_face4hole_m3_outrunner
```

`brushlessdcmotor` defines an outrunner brushless DC motor with a vented
rotating bell (`outerDiameter`, `length`), a coaxial output shaft
(`shaftDiameter`, `shaftLength`), and four equally spaced right-hand ISO metric
coarse (`6H`) stator mounting holes on `boltPitchCircleDiameter`. Value-free
`face4hole` and `outrunner` flags replace legacy `mount(...)` and `style(...)`
selectors.

## Local frame and defaults

- Front stator mounting plane lies at `Z=0`, motor bell rear lies at
  `Z=-length` (`-40 mm`), and output shaft reaches `Z=shaftLength` (`15 mm`).
- Default `42 mm` OD outrunner places four `M3` holes at `90`-degree intervals
  on a `30 mm` bolt circle (`(±15, 0)` and `(0, ±15)` mm).

`getBrushlessDcMotorDimensions` resolves overall axial length, thread depth, and
mounting hole coordinates in millimeters. Geometry generation belongs in
`jscad-electronics`.
