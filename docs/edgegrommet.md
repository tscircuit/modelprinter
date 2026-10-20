# EdgeGrommet

`edgegrommet_l100mm_w5mm_h6mm_slotw2mm_slotd4mm_corner1mm`

A continuous U edge protector with its length along X, outer width along Y, and mounting envelope Z=0..height. The panel slot opens at Z=0, spans Y=±slotWidth/2, and terminates at Z=slotDepth. The part is centered on X/Y; both cut ends are square. All four outer Y/Z cross-section corners are circular with cornerRadius, default 1mm; use corner0mm for sharp corners. The slot's internal corners are square, with no invented lips or grip ribs. This model always has the roadmap U profile, so the string needs no profile selector. Length, width, height, slotWidth and slotDepth are required. Radius checks preserve both walls and the closed top web.

Short tokens and their full-length aliases normalize to the same strict public schema; repeated aliases are rejected. Lengths accept millimeters by default or mm, cm, m, in/inch, mil and ft/feet. All coordinates and dimensions normalize to millimeters. This is nominal custom CAD geometry, without a load rating or an implicit manufacturer specification.
