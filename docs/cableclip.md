# CableClip

`cableclip_cable6mm_w12mm_h10mm_t2mm_arc240deg_tab10mm_hole3mm`

A custom circular cable retaining loop extruded along Y. The loop center is X=0, Z=height/2, width spans Y=±width/2, and the mounting surface is Z=0. The arc is symmetric about negative X, leaving its opening toward positive X. Height equals cable diameter plus twice the wall thickness; it is not an independent stretched ellipse. The tab extends tabLength beyond the nominal outer-circle positive-X radius, with a root reaching X=0 to join the lower ring. Its single Z-axis through bore is at X=height/2+tabLength/2, Y=0. The tab and ring share wall thickness. Arc defaults to 240 degrees; every length in the example is required.

Short tokens and their full-length aliases normalize to the same strict public schema; repeated aliases are rejected. Lengths accept millimeters by default or mm, cm, m, in/inch, mil and ft/feet. All coordinates and dimensions normalize to millimeters. This is nominal custom CAD geometry, without a load rating or an implicit manufacturer specification.

The retaining arc uses facets spanning at most two degrees. Inner facets circumscribe the nominal cable circle, preserving the stated minimum radial opening. Outer facets lie inside the nominal outer circle. A wall thinner than `(cableDiameter/2)*tan(1 degree)^2` is rejected because those two polygonal boundaries could intersect. Mounting bores are nominal 96-segment cylinders; their inscribed facet radial deviation is at most `(holeDiameter/2)*(1-cos(pi/96))` (0.000803mm for the 3mm sample bore).
