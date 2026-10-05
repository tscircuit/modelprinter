# PCB card guide (roadmap 0074)

`mp.string("pcbcardguide_l100mm_w8mm_h10mm_slotw1.8mm_slotd6mm_mounts2_hole3mm_hp90mm").json()` defines a custom straight, top-loading board guide. `spec(customv1)` is the fixed construction contract, not a supplier series. Dimensions normalize to millimeters. Geometry is owned by jscad-electronics.

The body is a rectangular prism centered in X and Y, with its mounting face at Z=0. Length follows X, width follows Y, and height follows +Z. The square-ended rectangular guide slot opens at Z=height, is centered at Y=0, and has a blind depth of `slotDepth`. There are no fillets, chamfers, threads, countersinks, or secondary openings.

Two vertical circular through-holes lie at (X,Y) = (−holePitch/2,0) and (+holePitch/2,0). Solid end pads keep these mounting holes separate from the slot: the slot spans X=±(holePitch/2−holeDiameter/2−endWeb). The default example therefore has an 85 mm slot, two 7.5 mm end pads, and a 1 mm web between each slot end and adjacent hole edge. A board can enter vertically; this contract does not describe a guide open through its end pads.

| Property | Tokens | Default |
| --- | --- | --- |
| length, width, height | l/length, w/width, h/height | 100, 8, 10 |
| slotWidth, slotDepth | slotw/slotwidth, slotd/slotdepth | 1.8, 6 |
| mountCount | mounts/mountcount | 2 (only supported layout) |
| holeDiameter, holePitch | hole/holediameter, hp/holepitch | 3, 90 |
| endWeb | endweb | 1 |
| mountEdgeMargin | mountedgemargin | 1 |

All lengths are finite and positive. The slot leaves a positive floor and two positive side walls. Mount holes must leave `mountEdgeMargin` on the two body ends and sides, and their spacing must allow a positive slot length after subtracting both webs and the hole diameter. Unknown fields, unsupported specs/layouts, missing values, duplicate tokens and conflicting aliases are rejected. Compact strings are case-insensitive; direct props use the documented property names and literal spec. Public props/definition schemas and input/output types are exported.
