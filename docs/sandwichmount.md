# SandwichMount

`sandwichmount_w50mm_l50mm_h25mm_holepitch35mm_holed6mm_coreh19mm_platethickness3mm`

Rectangular bonded isolator centered on XY, bottom Z=0. Equal end plates surround a solid elastomer core. Four plain bores on a centered square grid pass through the entire assembly so fixing access is explicit. No load rating implied.

Dimensions are independent of material, tolerance, load ratings and manufacturing process. Normalized lengths are millimeters. Required dimensions: width, length, height, holePitch, holeDiameter, coreHeight, plateThickness. Defaults: {}. Compact tokens and full property names (case insensitive) are accepted; duplicate aliases and unknown tokens are rejected. Counts are positive integers; invalid or impossible profiles are rejected.

Cross-property constraints (all must be false):
- `Math.abs(p.coreHeight+2*p.plateThickness-p.height)>1e-8*Math.max(1,p.height)`
- `p.holePitch+p.holeDiameter >= Math.min(p.width,p.length)`
- `p.holeDiameter >= p.holePitch`
