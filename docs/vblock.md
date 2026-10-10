# VBlock

`vblock_l60mm_w40mm_h40mm_vangle90deg_vdepth10mm_mountgroovew3mm_mountgrooved3mm_mountz10mm`

Inspection block centered on XY, bottom Z=0. The centered V runs along X; vangle is its included angle. Both Y side faces have full-length rectangular clamp grooves centered at mountz.

Dimensions are independent of material, tolerance, load ratings and manufacturing process. Normalized lengths are millimeters. Required dimensions: length, width, height, grooveAngle, grooveDepth, mountGrooveWidth, mountGrooveDepth, mountGrooveZ. Defaults: {}. Compact tokens and full property names (case insensitive) are accepted; duplicate aliases and unknown tokens are rejected. Counts are positive integers; invalid or impossible profiles are rejected.

Cross-property constraints (all must be false):
- `p.grooveAngle <= 0 || p.grooveAngle >= 180`
- `p.grooveDepth >= p.height`
- `2*p.grooveDepth*Math.tan(p.grooveAngle*Math.PI/360) >= p.width`
- `2*p.mountGrooveDepth >= p.width`
- `p.mountGrooveZ-p.mountGrooveWidth/2 <= 0`
- `p.mountGrooveZ+p.mountGrooveWidth/2 >= p.height-p.grooveDepth`
