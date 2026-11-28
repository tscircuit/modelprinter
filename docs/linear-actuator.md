# Linear actuator parameter contract

```text
linearactuator_bodyod40mm_l250mm_stroke100mm_rodod20mm_eyeeye_eyebore8mm_electricscrew
```

`linearactuator` defines a tubular electric-screw linear actuator in its closed
(`retractedLength`) pose along `+Z` with transverse `eyeBoreDiameter` pivot eyes
at both ends. Value-free `eyeeye` and `electricscrew` flags replace legacy
`mount(...)` and `style(...)` selectors.

## Local frame and defaults

- Rear pivot-eye bore center lies at `Z=0`, retracted front rod-eye bore center
  lies at `Z=retractedLength` (`250 mm`), and full extension reaches
  `Z = retractedLength + stroke` (`350 mm`).
- Default diameters satisfy `eyeBoreDiameter` (`8 mm`) < `rodOuterDiameter`
  (`20 mm`) < `bodyOuterDiameter` (`40 mm`).

`getLinearActuatorDimensions` resolves retracted/extended center-to-center spans
and overall envelope bounds in millimeters. Geometry generation belongs in
`jscad-electronics`.
