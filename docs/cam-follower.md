# Cam follower parameter contract

```text
camfollower_od22mm_w12mm_studd10mm_studl20mm_needlebearing_studmount_m10
```

`camfollower` defines a stud-type needle-roller cam follower with a thick outer
race (`outerDiameter`, `width`) and a coaxial right-hand ISO metric coarse (`6g`)
mounting stud (`metricSize`, `studLength`). Value-free `needlebearing` and
`studmount` flags replace legacy `bearing(...)` and `mount(...)` selectors.

## Local frame and defaults

- Roller mounting shoulder lies at `Z=0`, thick outer race spans `Z=0` to
  `Z=width` (`12 mm`), and the threaded stud projects coaxially from `Z=0` to
  `Z=-studLength` (`-20 mm`).
- Supported stud sizes are `M5`, `M6`, `M8`, `M10` (default), `M12`, `M16`, and
  `M20`; `studDiameter` defaults to the nominal metric size when omitted.

`getCamFollowerDimensions` resolves overall axial length, radial race-and-roller
section, and axial elevations in millimeters. Geometry generation belongs in
`jscad-electronics`.
