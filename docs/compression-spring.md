# Compression spring parameter contract

`compressionspring_spec(custom)_od8mm_wire1mm_l20mm_turns8_active6_ends(closedground)_hand(right)_state(free)`
selects custom construction version 1. This family defines an exact nominal
spring for assembly visualization; it does not claim a standard profile,
material stiffness, force, fatigue life or manufacturing tolerances.

Required tokens are `od` (outside diameter), `wire` (round-wire diameter),
`l`/`length`/`freelength` (free bearing-face separation), and `turns` (total
complete revolutions). `active` is optional and defaults to totalTurns-2.
`spec(custom)`, `ends(closedground)`, `hand(right)` and `state(free)` are defaults.
`hand(left)` mirrors winding. Only this end construction and free state are
supported; open ends, unground ends, variable-pitch coils and loaded/solid
poses require separate contracts. No `threadhand` token is used: winding is
independent of thread conventions.

All lengths accept positive finite millimeter numbers or complete numeric
strings with `mm`, `cm`, `m`, `in`, `inch`, `mil`, `ft`, or `feet`, normalized to
mm in JSON. Counts are safe integers: totalTurns>=3, activeTurns>=1, and exactly
totalTurns=activeTurns+2. Outside diameter must exceed twice wire diameter so
the bore remains positive. Free length must strictly exceed the finite nominal
solid height totalTurns*wireDiameter. Contradictory active counts, fractional
turn counts, duplicate aliases/tokens, unknown parameters, value-bearing flags,
inline family arguments and malformed selectors are rejected by the string
and strict schema APIs.

The axis is Z, centered at x=y=0. The lower ground mounting plane is z=0 and
the upper ground plane is z=freeLength. The free pose has zero applied load.
The initial wire center lies on the +X ray at z=0; both wire terminals share
that ray because the count is integral. Mean diameter is OD-wire, inside
diameter is OD-2*wire. There is one inactive closed turn at each end and
activeTurns uniform-pitch central turns. With turn coordinate t in [0,N],
wire diameter d, free length L, A=N-2 and mean radius R=(OD-d)/2, define:

- theta(t)=2*pi*t for right hand, -2*pi*t for left hand.
- x(t)=R*cos(theta), y(t)=R*sin(theta).
- z(t)=d*t for 0<=t<=1.
- z(t)=d+(L-2*d)*(t-1)/A for 1<=t<=N-1.
- z(t)=L-d*(N-t) for N-1<=t<=N.

Right hand therefore advances counterclockwise when viewed from +Z as z
increases. Each end turn has centerline pitch d (adjacent closed turns touch);
the central pitch is (L-2*d)/A. The pitch changes at t=1 and N-1 without an
additional blend, transition turn or end hook. No turn is added by a renderer.
`getCompressionSpringCenterlinePoint` exposes this definition for datum checks.

The nominal wire construction sweeps a radius-d/2 circular section in the
radial/axial plane through the Z axis at every theta, with its center on the
path. This fixes the section frame: it is not the plane normal to the helix.
The radial/axial frame is a visualization simplification that gives exact OD,
ID and closed pitch d without a pitch-dependent envelope or unrequested end
transition. Terminal sections are flat cut in those radial/axial planes.
Clip the entire construction to 0<=z<=L, producing the two planar ground
surfaces and removing the outer axial half of each terminal section. No
terminal rounding, edge chamfer, weld, root fillet, extra end rotation or
material/coating thickness is implied. This ground/end convention is custom,
not a claim about a particular manufacturer's grind depth or closed-end recipe.

Nominal solid height is N*d under this construction: at L=N*d the central
pitch equals d and all turns close. That limiting pose is not accepted as a
free spring. Available travel is L-N*d; it is a geometric clearance, not a
rated operating stroke. `getCompressionSpringDimensions` returns these values,
the diameters, pitches and bearing datums without generating geometry.
For the example, ID=6 mm, mean diameter=7 mm, active pitch=3 mm, solid height=8
mm, and available travel=12 mm. Renderers belong in jscad-electronics.
