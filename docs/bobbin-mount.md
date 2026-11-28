# Bobbin mount parameter contract

```text
bobbinmount_od25mm_h20mm_studd6mm_studl15mm_studstud_m6
```

`bobbinmount` defines a cylindrical bonded vibration isolator along `+Z` with
metric external threaded mounting studs projecting from both end plates
(`studstud`). Legacy `mount(studstud)` selectors are rejected in favor of the
value-free `studstud` flag.

## Local frame and defaults

- Lower end plate sits at `Z=0` and upper end plate sits at `Z=height`
  (`20 mm`), with equal `studLength = 15 mm` threaded studs extending to
  `Z=-15 mm` and `Z=35 mm` (`overallLength = 50 mm`).
- Default body and thread parameters are `outerDiameter = 25 mm`,
  `metricSize = "M6"` (`threadPitch = 1 mm`), and `studDiameter = 6 mm`.
- Validation enforces `studDiameter == nominalMetricDiameter`,
  `outerDiameter > studDiameter`, and `studLength > threadPitch`.

`getBobbinMountDimensions` resolves coarse thread pitch, end-plate thickness,
elastomer height, stud tip coordinates, and total axial envelope in millimeters.
Geometry generation belongs in `jscad-electronics`.
