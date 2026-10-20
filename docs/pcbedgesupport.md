# PcbEdgeSupport

`pcbedgesupport_w20mm_d12mm_h15mm_slotw1.8mm_slotd6mm_bw10mm_bt2mm_holes2_hole3mm_hp14mm`

A PCB edge support with a complete rectangular base, narrower upright, and centered transverse board slot. The base spans X=±width/2, Y=±depth/2, Z=0..baseThickness. The upright spans X=±bodyWidth/2 and the same Y depth, reaching Z=height. Its top slot runs through both X faces, spans Y=±slotWidth/2, and has floor Z=height-slotDepth. Two Z-axis base bores are at X=±holePitch/2, Y=0. Their diameter is explicit; no hidden counterbore is present. The original roadmap omits upright width and base thickness; bw10mm and bt2mm in this sample fix those fitting surfaces. Base thickness defaults to 2mm and hole count defaults to two; other dimensions are required. Strict clearance checks keep each mounting bore wholly in an exposed foot rather than under the body.

Short tokens and their full-length aliases normalize to the same strict public schema; repeated aliases are rejected. Lengths accept millimeters by default or mm, cm, m, in/inch, mil and ft/feet. All coordinates and dimensions normalize to millimeters. This is nominal custom CAD geometry, without a load rating or an implicit manufacturer specification.
