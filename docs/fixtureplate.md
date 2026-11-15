# FixturePlate

`fixtureplate_l80mm_w60mm_t8mm_hole6mm_cols3_rows2_pitch25mm_edgex15mm_edgey15mm`

XY workholding plate with an explicitly located rectangular grid of plain through-holes. Counts, pitch and first-hole margins are independent; the grid must remain inside the plate. Bottom Z=0; no threads or counterbores implied.

Dimensions are independent of material, tolerance, load ratings and manufacturing process. Normalized lengths are millimeters. Required dimensions: length, width, thickness, holeDiameter, columns, rows, pitch, edgeX, edgeY. Defaults: {}. Compact tokens and full property names (case insensitive) are accepted; duplicate aliases and unknown tokens are rejected. Counts are positive integers; invalid or impossible profiles are rejected.

Cross-property constraints (all must be false):
- `p.holeDiameter >= p.pitch`
- `Math.min(p.edgeX,p.edgeY) <= p.holeDiameter/2`
- `p.edgeX+(p.columns-1)*p.pitch+p.holeDiameter/2 >= p.length`
- `p.edgeY+(p.rows-1)*p.pitch+p.holeDiameter/2 >= p.width`
- `p.columns*p.rows>2500`
