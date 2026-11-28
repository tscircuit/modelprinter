# Plain wheel parameter contract

```text
plainwheel_od75mm_w25mm_bore10mm_hubod30mm_axlebore_hubw30mm_roundedge
```

`plainwheel` defines a solid cylindrical disc wheel along `+Z` with rounded
tread edges (`roundedge`), a symmetric raised central hub, and a concentric
through axle bore (`axlebore`). Legacy `mount(...)` and `edge(...)` enum tokens
are rejected in favor of value-free flags.

## Local frame and defaults

- Lower hub face lies at `Z=0` and upper hub face lies at `Z=hubWidth`
  (`30 mm`), with the `width = 25 mm` wheel disc centered axially from
  `Z=2.5 mm` to `Z=27.5 mm`.
- Default diameters are `outerDiameter = 75 mm`, `hubDiameter = 30 mm`, and
  `boreDiameter = 10 mm`.
- Validation enforces `boreDiameter < hubDiameter < outerDiameter` and
  `hubWidth >= width`.

`getPlainWheelDimensions` resolves symmetric hub projection, hub wall thickness,
radial web span, and tread edge radius in millimeters. Geometry generation
belongs in `jscad-electronics`.
