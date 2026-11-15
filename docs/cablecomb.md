# CableComb

`cablecomb_w60mm_h10mm_d8mm_slots6_slotw6mm_slotd7mm_p8mm_holes2_hole3mm_hp52mm`

A custom straight comb centered on X/Y and seated at Z=0. Width is X, depth is Y, and height is Z. Equal rectangular slots run through both Y faces and open upward, with their floor at height-slotDepth. Slot i is centered at X=(i-(slotCount-1)/2)*slotPitch. Two Z-axis mounting bores at X=±holePitch/2, Y=0 pass through the end walls for the full height. Hole count defaults to two; only two is supported. All other dimensions/counts are required. Validation requires separate teeth, a bottom spine, and mounting bores wholly outside the slots and inside the envelope.

Short tokens and their full-length aliases normalize to the same strict public schema; repeated aliases are rejected. Lengths accept millimeters by default or mm, cm, m, in/inch, mil and ft/feet. All coordinates and dimensions normalize to millimeters. This is nominal custom CAD geometry, without a load rating or an implicit manufacturer specification.
