# Split washer

`splitwasher_id6.1mm_od11.8mm_t1.6mm_rise1.6mm_gapangle10deg_rectangular_righthanded`
defines a dimensioned free-state split washer. This is a custom rectangular-section
construction, without a load, tolerance or standard-conformity claim.

`id`/`innerdiameter`, `od`/`outerdiameter`, `t`/`thickness`, and `rise` accept
model lengths and normalize to millimeters. All five dimensions, including
`gapangle`, are required. The diameters and thickness are positive, OD exceeds ID,
rise is nonnegative, and the omitted angular sector is strictly between 0 and 360
degrees. `gapangle` accepts an optional `deg` suffix. Unknown or repeated
parameters, including aliases and flags, fail validation.

The annulus starts at +X. For the default `righthanded` construction its angle
increases counterclockwise when viewed from +Z through `360 - gapangle` degrees,
while its section center rises from Z=thickness/2 to Z=thickness/2+rise.
`lefthanded` mirrors the entire construction through the XZ plane. `right` and
`left` are aliases. The section stays radial/vertical, with sharp edges and flat
radial end cuts; it is not rotated normal to the helical tangent. `rectangular`
is the only supported section and defaults to true.

The lowest face is Z=0 and total height is thickness+rise: the example has a
3.2 mm axial envelope. There are no unstated chamfers, bent teeth or extra turns.
`getSplitWasherDimensions` exposes radial width, sweep angle, total height and
the analytic volume of this construction. Geometry belongs in jscad-electronics.
