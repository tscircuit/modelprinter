# Torsion spring

`torsionspring_od8mm_wire0.8mm_turns3.25_pitch1mm_start10mm_end14mm_right`

Generic free-state torsion-spring reference with open helical coils and two
straight tangent legs. It does not specify spring material, preload, allowable
rotation, force, fatigue life or a vendor part. This first contract does not
represent closed/contacting coils, double torsion springs or bent hooks.

| Token | Public property | Default |
| --- | --- | --- |
| od | outerDiameter | 8 mm |
| wire | wireDiameter | 0.8 mm |
| turns | turns | 3.25 |
| pitch | pitch | 1.25 times wire diameter |
| start | startLegLength | 10 mm |
| end | endLegLength | 14 mm |
| left / right | leftHand | false (right) |

Lengths normalize to millimeters. `turns` is unitless, permits fractions, and
ranges from 1 through 128. Outer diameter is at least three wire diameters;
pitch is at least 1.1 wire diameters to provide clear, non-contacting coils.
Leg lengths are positive. Unknown/repeated tokens, conflicting hand flags and
nonfinite dimensions are errors. Hand flags have no arguments. The normalized
boolean `leftHand` is true for `_left`, false for `_right` or no flag.

The coil axis is Z; the first coil centerline point is `(meanRadius,0,0)`.
Right-hand winding increases phase from +X toward +Y while advancing +Z.
Left-hand winding mirrors the centerline through the XZ plane. Fractional turns
set the relative terminal phase: 3.25 turns ends at 90 degrees, 4.5 at 180 degrees.
Each leg extends the exact helical tangent, including its small axial slope;
it is not constrained to an XY end plane. Circular wire sections are normal to
the centerline, and the free wire ends are normal-cut. OD describes the coil,
not the complete leg envelope; geometry can extend below Z=0.

`getTorsionSpringDimensions` reports mean radius, bore, axial centerline advance,
coil and total wire centerline lengths, pitch and end phase. `getTorsionSpringFrame`
returns position and orthonormal tangent/normal/binormal axes at distance from
the first free leg end; this range includes both legs. Lengths/frames are shared
between renderers; schemas and model strings live here, meshes/snapshots in
jscad-electronics. No renderer-specific sampling resolution is in the contract.
