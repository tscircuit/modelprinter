# Hex nut parameter contract

`hexnut_standard(iso4032)_m6` selects the fifth edition, ISO 4032:2023,
Table 1 and Figure 1 (regular style 1, without the optional washer-face).
`standard(iso4032:2023)` is equivalent and this edition is also the default.
[The primary preview](https://cdn.standards.iteh.ai/samples/75016/5b1f83bd2dc44fc199973e9957a75086/ISO-4032-2023.pdf)
contains the dimension table pinned in exported `hexNutDimensions`.

| Size | Coarse pitch | Across flats | Height | Bore-mouth diameter |
| --- | --- | --- | --- | --- |
| M5 | 0.8 | 8 | 4.7 | 5.75 |
| M6 | 1 | 10 | 5.2 | 6.75 |
| M8 | 1.25 | 13 | 6.8 | 8.75 |
| M10 | 1.5 | 16 | 8.4 | 10.8 |
| M12 | 1.75 | 18 | 10.8 | 12.96 |

These lengths are mm. Across flats uses nominal/max s, height uses maximum m,
and the two bore mouths use maximum da. Only these five preferred grade A
sizes are supported. M3 is outside the normative 2023 size range; it is not
silently treated as a conforming regular nut. No DIN 934 alias is provided:
its M10/M12 wrench dimensions differ. Table-selected dimensions cannot be
changed with body/envelope tokens or object properties. This family describes
one untoleranced nominal visualization, not a manufactured tolerance model.

`m` is required. `standard` defaults as above. `threadpitch` can restate the
coarse pitch, using a millimeter number or complete numeric unit string (`mm`,
`cm`, `m`, `in`, `inch`, `mil`, `ft`, `feet`); all lengths normalize to mm. A
contradictory/fine pitch is rejected. `threadhand(right)` and `threadclass(6H)`
are fixed defaults. Other hands/classes and washer-face variants require a
separate contract. `showThreads` defaults true; `threads`/`nothreads` are
value-free visibility flags. Strings are case insensitive; the normalized
internal thread class remains `6H`. Duplicate tokens, malformed selectors,
inline family arguments, unknown tokens and unknown schema properties fail.

The mounting datum is the lower face at z=0. The nut is centered on Z and
extends to z=height. The body is a regular hexagon with two flats parallel to
XZ (y=+/-acrossFlats/2). Its ideal across-corners diameter is
2*acrossFlats/sqrt(3); toleranced corner rounding is omitted. Both ends are
chamfered by coaxial cones, each 30 degrees to its end face, with circular
face diameter equal to acrossFlats. Chamfer depth at a corner is
(acrossCorners-acrossFlats)/(2*sqrt(3)). The cones meet the full hexagon at
that depth from each end. This fixes the standard's optional 15–30 degree
chamfer range at 30 degrees. There is no raised washer-face. All other edge
radii/chamfers and markings are omitted.

The primary interface is a through, internal, right-hand, single-start ISO
metric coarse thread with 60 degree basic profile and nominal 6H identity.
The untoleranced minor diameter is D-5*sqrt(3)*pitch/8 and pitch diameter
is D-3*sqrt(3)*pitch/8. At each axial period the internal crest flat at the
minor diameter has width pitch/4, the root flat at major diameter D has
width pitch/8, and each flank spans 5*pitch/16 axially. This fixes the
60 degree basic trapezoidal profile with sharp flank/flat junctions.
The two entrances have
90 degree included conical countersinks from bore-mouth diameter at each end
to that minor diameter. Each countersink depth is
(mouthDiameter-minorDiameter)/2. Thread grooves are clipped by those cones;
thread root rounding, manufacturing allowance and chamfer-related incomplete
turns are otherwise omitted. Phase is zero on the +X ray at z=0 and winds
counterclockwise as z increases. With `showThreads=false`, use a smooth
minor-diameter through bore and retain both countersinks.
`getHexNutDimensions` resolves these dimensions and datums without producing
meshes. Geometry generation belongs in jscad-electronics.
