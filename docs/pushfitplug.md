# PushFitPlug

`pushfitplug_tubeod6mm_l18mm_headod10mm_headt3mm`

Solid round push-in tube stopper with an integral flat extraction head. Overall length includes the head. Shaft axis is +Z; insertion tip Z=0, shoulder Z=length-headThickness. No seal or pressure rating implied.

Dimensions are independent of material, tolerance, load ratings and manufacturing process. Normalized lengths are millimeters. Required dimensions: tubeDiameter, length, headDiameter, headThickness. Defaults: {}. Compact tokens and full property names (case insensitive) are accepted; duplicate aliases and unknown tokens are rejected. Counts are positive integers; invalid or impossible profiles are rejected.

Cross-property constraints (all must be false):
- `p.headDiameter <= p.tubeDiameter`
- `p.headThickness >= p.length`
