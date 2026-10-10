# FlatCableClip

`flatcableclip_iw25mm_ih3mm_d10mm_t2mm_feet5mm_holes2_hole3mm_hp34mm`

A rectangular bridge for ribbon cable, centered on X/Y with its feet seated at Z=0. Inner width spans X; depth spans Y. The opening is X=±innerWidth/2, Z=0..innerHeight, fully open through both Y faces. Side walls and top use thickness; the top face is Z=innerHeight+thickness. Each foot extends footLength outward from a leg's outside face and is thickness high. Two Z-axis through bores lie at X=±holePitch/2, Y=0. Hole count defaults to two and only two is supported. Other dimensions are required. The roadmap's 31mm pitch would intersect a 2mm leg with a 3mm bore, so the documented sample uses 34mm pitch and validation rejects the collision.

Short tokens and their full-length aliases normalize to the same strict public schema; repeated aliases are rejected. Lengths accept millimeters by default or mm, cm, m, in/inch, mil and ft/feet. All coordinates and dimensions normalize to millimeters. This is nominal custom CAD geometry, without a load rating or an implicit manufacturer specification.
