# NEMA motor mounting bracket

`nemamotormount` is a custom rigid, sharp-corner 90-degree L bracket for common
NEMA17 and NEMA23 mounting interfaces. The function and strings use generic
frame names. Bracket dimensions, base drilling and material thickness are custom
nominal defaults, not NEMA requirements or a structural load rating.

```text
nemamotormount_nema17_w50mm_h60mm_depth40mm_t3mm_axisheight30mm_shaft23mm_motorhole3.5mm_basehole5.5mm_basexspan30mm_baseoffset20mm
nemamotormount_nema23_w70mm_h80mm_depth50mm_t4mm_axisheight40mm_shaft39.1mm_motorhole5.5mm_basehole5.5mm_basexspan45mm_baseoffset25mm
```

| Dimension (mm) | NEMA17 | NEMA23 |
| --- | ---: | ---: |
| Common square motor-hole spacing | 31 | 47.14 |
| Nominal projecting motor pilot diameter | 22 | 38.1 |
| Representative motor face width | 42.3 | 56.4 |
| Bracket width / overall height | 50 / 60 | 70 / 80 |
| Base depth toward motor / thickness | 40 / 3 | 50 / 4 |
| Axis height above base underside | 30 | 40 |
| Pilot and shaft through-opening diameter | 23 | 39.1 |
| Four motor clearance-hole diameters | 3.5 | 5.5 |
| Two base holes: diameter / X spacing / offset | 5.5 / 30 / 20 | 5.5 / 45 / 25 |

The common mounting and pilot values reuse `nemaMotorDimensions` from the motor
contract. Its reference drawings are [NEMA17 ST4118](https://www.nanotec.com/fileadmin/files/Baureihenuebersichten/Schrittmotoren/Product_Overview_ST4118.pdf)
and [NEMA23 ST5918](https://www.nanotec.com/fileadmin/files/Baureihenuebersichten/Schrittmotoren/Product_Overview_ST5918.pdf).
The NEMA frame designation alone does not specify every motor dimension; check
the actual motor drawing. This family deliberately fixes the common square
pattern. It does not represent slotted adjustment, a bent-sheet radius, threads,
fasteners, or counterbores.

Origin is the motor mounting face and shaft-axis intersection, matching the
existing NEMA motor datum. +X is right, +Y up and +Z along the shaft. The upright
occupies X=-width/2..width/2, Y=-axisHeight..height-axisHeight, Z=0..thickness.
The foot occupies that same X span, Y=-axisHeight..-axisHeight+thickness,
Z=-baseDepth..thickness. Its negative-Z extension lies underneath the motor.
The motor face contacts Z=0; the motor body is toward -Z and its pilot and shaft
pass through the central opening toward +Z. The floor/base mounting datum is
the underside Y=-axisHeight, with outward direction -Y.

Motor-hole centers are (±mountingHoleSpacing/2, ±mountingHoleSpacing/2, 0), each
cut along +Z through `thickness`. Base-hole entry centers are
(±baseHoleSpacing/2, -axisHeight+thickness, -baseHoleOffset), each cut along -Y
through `thickness`. `getNemaMotorMountHoles` returns these centers, diameters,
depths and directions; `getNemaMotorMountReferencePoints` returns the motor face,
shaft axis and underside base face. There are four motor holes and two base
holes. The central opening is a single through bore, without a blind pilot cap.

Tokens `nema`/`nemasize` accept unitless 17 or 23. Lengths accept finite positive
numbers in mm, or complete tokens with mm, cm, m, in/inch, mil, ft/feet units.
Aliases are w/width, h/height, depth/basedepth, t/thickness, axisheight,
span/mountspan/mountingholespacing, motorhole/mountingholediameter,
shaft/shaftclearance/shaftclearancediameter, basexspan/baseholespacing,
basehole/baseholediameter and baseoffset/baseholeoffset. Omitted values use the
selected frame's table. Explicit spans must match its common pattern. Duplicate
aliases, unknown tokens or fields, empty tokens, incomplete numbers and
manufacturer-specific suffixes are rejected.

Validation requires a bracket covering the representative motor face, and
`axisHeight > motorFaceWidth/2 + thickness` so the motor clears the base. The
opening exceeds the nominal pilot and motor holes exceed nominal fixing
diameters. Openings must leave positive material to each other and all plate
edges; base holes must clear the solid corner and free end. Both direct schemas
and parsing apply these same checks. Geometry and visual snapshots live in
jscad-electronics.
