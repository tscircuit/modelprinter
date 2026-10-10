# PerforatedSheet

`perforatedsheet_l60mm_w40mm_t1mm_hole3mm_pitchx10mm_pitchy10mm_edgex5mm_edgey5mm_stagger0mm`

Flat XY panel, bottom Z=0. Hole centers begin edgeX/edgeY from the negative edges, continue on stated pitches while respecting both opposite margins. Odd rows shift +stagger; incomplete edge holes are omitted. At most 2500 holes.

Dimensions are independent of material, tolerance, load ratings and manufacturing process. Normalized lengths are millimeters. Required dimensions: length, width, thickness, holeDiameter, pitchX, pitchY, edgeX, edgeY. Defaults: {"stagger": 0}. Compact tokens and full property names (case insensitive) are accepted; duplicate aliases and unknown tokens are rejected. Counts are positive integers; invalid or impossible profiles are rejected.

Cross-property constraints (all must be false):
- `p.holeDiameter >= Math.min(p.pitchX,p.pitchY)`
- `2*p.edgeX > p.length || 2*p.edgeY > p.width`
- `Math.min(p.edgeX,p.edgeY) <= p.holeDiameter/2`
- `p.stagger >= p.pitchX`
- `Math.floor((p.length-2*p.edgeX)/p.pitchX+1)*Math.floor((p.width-2*p.edgeY)/p.pitchY+1)>2500`
