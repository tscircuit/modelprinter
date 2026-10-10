# ChannelBar

`channelbar_w40mm_h20mm_web3mm_flange3mm_innerr3mm_tipr1mm_l60mm`

U-section stock centered on XY, opening toward +Y, length along +Z. Root radii and four free-tip radii preserve the outer envelope.

Dimensions are independent of material, tolerance, load ratings and manufacturing process. Normalized lengths are millimeters. Required dimensions: width, height, webThickness, flangeThickness, length. Defaults: {"innerRadius": 0, "tipRadius": 0}. Compact tokens and full property names (case insensitive) are accepted; duplicate aliases and unknown tokens are rejected. Counts are positive integers; invalid or impossible profiles are rejected.

Cross-property constraints (all must be false):
- `2*p.flangeThickness >= p.width`
- `p.webThickness >= p.height`
- `2*p.innerRadius >= p.width-2*p.flangeThickness`
- `p.innerRadius+p.tipRadius >= p.height-p.webThickness`
- `2*p.tipRadius >= p.flangeThickness`
