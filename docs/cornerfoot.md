# CornerFoot

```text
cornerfoot_w25mm_d25mm_h12mm_wall3mm_seat(20mm,20mm)_hole4mm_base3mm_cornercup
```

Square or rectangular corner foot centered on XY. Base mounting face is Z=0; the supported member sits at Z=baseThickness. Two perpendicular locating walls occupy the negative-X and negative-Y outside edges and reach Z=height. The stated seat starts at their inside corner. One central fixing hole at X=Y=0 passes through the base only. Base thickness defaults to the wall thickness. No rounded exterior or inferred load rating.

Lengths accept complete decimals with optional units and normalize to millimeters. The schema rejects unknown fields, duplicate aliases, malformed tokens and dimensions that eliminate required material. `getCornerFootDimensions` exposes the resolved dimensions and installation datums. Legacy roadmap selectors map to value-free flags; there are no enum selectors in the resolved contract.
