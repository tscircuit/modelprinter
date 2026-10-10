# RectangularTube

`rectangulartube_w40mm_h20mm_wall2mm_l60mm_outerr4mm_innerr2mm`

Open rectangular stock tube. Outer and inner radii are independent; minimum corner clearance is validated. Section centered on XY, ends Z=0 and Z=length.

Dimensions are independent of material, tolerance, load ratings and manufacturing process. Normalized lengths are millimeters. Required dimensions: width, height, wallThickness, length. Defaults: {"outerRadius": 0, "innerRadius": 0}. Compact tokens and full property names (case insensitive) are accepted; duplicate aliases and unknown tokens are rejected. Counts are positive integers; invalid or impossible profiles are rejected.

Cross-property constraints (all must be false):
- `2*p.wallThickness >= Math.min(p.width,p.height)`
- `2*p.outerRadius >= Math.min(p.width,p.height)`
- `2*p.innerRadius >= Math.min(p.width,p.height)-2*p.wallThickness`
- `p.wallThickness <= (1-Math.SQRT1_2)*(p.outerRadius-p.innerRadius)`
