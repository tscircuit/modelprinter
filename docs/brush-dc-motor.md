# Brushed DC motor parameter contract

```text
brushdcmotor_od36mm_l60mm_shaftd5mm_shaftl15mm_face2hole_pcd25mm_m3_roundcan
```

`brushdcmotor` defines a cylindrical round-can brushed DC motor with a coaxial
output shaft (`shaftDiameter`, `shaftLength`) projecting along `+Z` from the
front mounting face `Z=0` and two diametrically opposed right-hand ISO metric
coarse (`6H`) tapped mounting holes on `pitchCircleDiameter`. Value-free
`face2hole` and `roundcan` flags replace legacy `mount(...)` and `style(...)`
selectors.

## Local frame and defaults

- Front mounting face lies at `Z=0`, cylindrical motor can extends to
  `Z=-length` (`-60 mm`), and output shaft reaches `Z=shaftLength` (`15 mm`).
- Default `36 mm` OD motor uses a `5 × 15 mm` shaft and two `M3` tapped front
  holes at `(±12.5, 0)` mm (`pitchCircleDiameter = 25 mm`).

`getBrushDcMotorDimensions` resolves overall axial length, blind thread depth,
and mounting hole centers in millimeters. Geometry generation belongs in
`jscad-electronics`.
