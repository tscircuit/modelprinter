# Thrust ball bearing

`thrustballbearing_id10mm_od24mm_h9mm` implements roadmap #13 proposal 0079.
The function and public API from the original bearing proposal are retained:
`thrustBallBearingDefaults`, `thrustBallBearingModelPropsSchema`,
`thrustBallBearingModelDefinitionSchema`, and the corresponding
`ThrustBallBearingModelPropsInput`, `ThrustBallBearingModelProps` and
`ThrustBallBearingModelDefinition` types.

| Property | Tokens | Default |
| --- | --- | --- |
| `innerDiameter` | `id`, `innerdiameter` | 10 mm |
| `outerDiameter` | `od`, `outerdiameter` | 24 mm |
| `height` | `h`, `height` | 9 mm |

The default is the 51100 single-direction thrust bearing boundary envelope,
confirmed by the [NSK 51100 dimensional table](https://www.nsk.com/engineering/51100-apn.html).
These are boundary dimensions, not manufacturing tolerances or a load-rated
internal design. Thrust bearing boundary dimensions use ISO 104; radial bearing
ISO 15 dimensions do not define this family. The applicable reference is
[ISO 104:2015](https://committee.iso.org/standard/62974.html?browse=ics).
Custom positive envelopes with
`innerDiameter < outerDiameter` are accepted without a standard-size claim.

Numbers mean millimeters. Complete decimal lengths accept `mm`, `cm`, `m`,
`in`, `inch`, `mil`, `ft` and `feet`; parsed output is finite numeric millimeters.
Model and token names are case-insensitive. Omitted dimensions use the defaults.
Unknown tokens/properties, repeated dimensions including aliases, missing
values, inline root values, malformed unit suffixes and exponent strings fail.

The bearing axis is +Z. The lower flat mounting face is Z=0; the upper mounting
face is Z=`height`. Both washers retain an open cylindrical bore of
`innerDiameter`; their outside diameter is `outerDiameter`. Both washers use
the same nominal envelope, without an inferred shaft/housing fit.

`getThrustBallBearingDimensions` exposes deterministic illustrative internals
for the renderer. Let radial width `W=(OD-ID)/2`, pitch radius
`C=(OD+ID)/4`, and ball radius `R=min(0.28W,0.24H)`. Balls are centered at
Z=`H/2`, equally spaced starting on +X. Their count is
`max(3,min(24,floor(pi*C/(1.4R))))`. Each washer's plain facing surface is
Z=`H/2-0.82R` or its upper mirror. A circular race groove of radius `1.08R`,
centered at `(C,H/2)` in radial/Z section, cuts that surface between the two
circle intersections; its deepest point leaves positive washer thickness.
The groove deliberately clears the nominal sphere by `0.08R`.

The nominal cage is an annular plate centered at Z=`H/2`, with thickness `0.3R`,
inner/outer radii `C-1.25R`/`C+1.25R`, and through pockets of radius `1.1R`
at the ball centers. The count formula leaves separate pockets and balls;
the balls, cage and washers are separate solids. These choices do not reproduce
a manufacturer's ball count, cage design, race curvature, edge chamfers,
clearance class, preload, tolerances or ratings. Geometry belongs to
`jscad-electronics`; this package supplies its dimensional contract.
