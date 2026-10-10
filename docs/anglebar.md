# AngleBar

`anglebar_w25mm_h25mm_t3mm_innerr3mm_tipr1mm_l60mm`

L-section stock, centered envelope on XY with the outside corner at minimum X/Y. Inner root and four free-tip corners accept circular fillets. Length runs along +Z.

Dimensions are independent of material, tolerance, load ratings and manufacturing process. Normalized lengths are millimeters. Required dimensions: width, height, thickness, length. Defaults: {"innerRadius": 0, "tipRadius": 0}. Compact tokens and full property names (case insensitive) are accepted; duplicate aliases and unknown tokens are rejected. Counts are positive integers; invalid or impossible profiles are rejected.

Cross-property constraints (all must be false):
- `p.thickness >= Math.min(p.width,p.height)`
- `p.innerRadius >= Math.min(p.width,p.height)-p.thickness`
- `2*p.tipRadius >= p.thickness`
- `p.innerRadius+p.tipRadius >= Math.min(p.width,p.height)-p.thickness`
