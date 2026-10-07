# Deep-groove radial ball bearing

`ballbearing_code608_closure(open)` selects the common 608 envelope: bore 8 mm,
outside diameter 22 mm, overall width 7 mm. The other supported designations
are 625 (5 × 16 × 5), 624 (4 × 13 × 5), 6000 (10 × 26 × 8),
6001 (12 × 28 × 8), and 6002 (15 × 32 × 9), all in mm. These are conventional
bearing designations associated with the ISO 15 radial-bearing boundary
dimension system, not manufacturer names. See [ISO 15](https://www.iso.org/search.html?q=ISO%2015).
The designation specifies only this table's envelope; it does not specify
our cage, ball count, race grooves, chamfers, shield or seal construction.

The original custom-envelope contract remains available:
`ballbearing_id8mm_od22mm_w7mm`. Without a designation, all three dimensions
are independently optional and default to `innerDiameter: 8`,
`outerDiameter: 22`, `width: 7`. A `code` supplies omitted dimensions; explicit
dimensions must match the selected envelope after unit conversion. Custom
bores must be positive and strictly smaller than the outside diameter;
width must be positive. Dimensions are untoleranced nominal values.

Tokens are `id`/`innerdiameter`, `od`/`outerdiameter`, `w`/`width`, `code`, and
`closure(open|shielded|sealed)` with a parenthesized single closure value.
Closure defaults to `open`. Both `shielded` and `sealed` close both faces,
while leaving the shaft bore open. The renderer differentiates thin metal
shields from profiled rubber seals and includes a snapshot of each variant.
Aliases are case insensitive. Unknown, duplicated, empty or incomplete tokens
are rejected, including repeated aliases of the same property.

Numbers mean millimeters. Complete unit strings accept mm, cm, m, in, inch,
mil, ft and feet, case insensitive; trailing text and exponent notation are
rejected. Direct strict schemas accept the same lengths. Public APIs retain
`ballBearingDefaults`, `ballBearingModelPropsSchema`,
`ballBearingModelDefinitionSchema`, and their `BallBearingModelPropsInput`,
`BallBearingModelProps`, `BallBearingModelDefinition` types.
`ballBearingStandardSizes` and `getBallBearingDimensions` are additional APIs.

The shaft axis is Z; X/Y center is the origin. Overall faces are Z=0 and
Z=width, and the ball plane is Z=width/2. The first of eight nominal balls is
on +X. The dimensions helper owns the visualization's ball radius, pitch
radius, positive race walls, circular groove clearance, rim chamfers, cage
bands/separators and closure thickness. These are explicitly chosen visual
internals, not standard raceway tolerances, fits, load ratings or a supplier
product. Very small custom dimensions remain accepted by the legacy schema;
the renderer rejects proportions below its documented numerical resolution.
