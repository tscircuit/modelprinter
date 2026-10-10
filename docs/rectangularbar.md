# RectangularBar

`rectangularbar_w20mm_h12mm_l60mm_cornerr1mm`

Solid rectangular stock with optional longitudinal corner radii. Cross section is centered on XY; open length direction is +Z.

Dimensions are independent of material, tolerance, load ratings and manufacturing process. Normalized lengths are millimeters. Required dimensions: width, height, length. Defaults: {"cornerRadius": 0}. Compact tokens and full property names (case insensitive) are accepted; duplicate aliases and unknown tokens are rejected. Counts are positive integers; invalid or impossible profiles are rejected.

Cross-property constraints (all must be false):
- `p.cornerRadius * 2 >= Math.min(p.width, p.height)`
