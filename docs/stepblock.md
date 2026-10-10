# StepBlock

`stepblock_l60mm_w30mm_h40mm_steps8_steprun7.5mm_steprise5mm`

Solid stair-step clamp support centered on XY, bottom Z=0. Staircase rises from -X toward +X. Equal runs and rises must exactly span the specified length and height.

Dimensions are independent of material, tolerance, load ratings and manufacturing process. Normalized lengths are millimeters. Required dimensions: length, width, height, steps, stepRun, stepRise. Defaults: {}. Compact tokens and full property names (case insensitive) are accepted; duplicate aliases and unknown tokens are rejected. Counts are positive integers; invalid or impossible profiles are rejected.

Cross-property constraints (all must be false):
- `Math.abs(p.steps*p.stepRun-p.length)>1e-8*Math.max(1,p.length)`
- `Math.abs(p.steps*p.stepRise-p.height)>1e-8*Math.max(1,p.height)`
