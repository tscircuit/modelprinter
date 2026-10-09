# Hex nut parameter contract

`hexnut_m6` defaults to the fifth edition, ISO 4032:2023,
Table 1 and Figure 1 (regular style 1, without the optional washer-face).
The optional value-free `iso4032` flag restates the selection:
`hexnut_m6_iso4032` produces the same normalized definition.
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
sizes are supported. M3 is outside the normative 2023 size range; `hexnut_m3` uses DIN 934.
An explicit ISO selector rejects sizes outside its supported range. DIN 934 is an explicit alternative, not an alias:
its M10/M12 wrench dimensions differ. Table-selected dimensions cannot be
changed with body/envelope tokens or object properties. This family describes
one untoleranced nominal visualization, not a manufactured tolerance model.

Exactly one of `m` or `imperial(...)` is required. ISO, DIN and ASME family flags default by size as above. `threadpitch` can restate the
coarse pitch, using a millimeter number or complete numeric unit string (`mm`,
`cm`, `m`, `in`, `inch`, `mil`, `ft`, `feet`); all lengths normalize to mm. A
contradictory/fine pitch is rejected. `threadhand(right)` and `threadclass(6H)`
are fixed defaults. Other hands/classes and washer-face variants require a
separate contract. `showThreads` defaults true; `threads`/`nothreads` are
value-free visibility flags. Strings are case insensitive; the normalized
internal thread class remains `6H`. Duplicate tokens, malformed selectors,
inline family arguments, unknown tokens and unknown schema properties fail.
The optional family flags are `iso4032`, `din934` and `asmeb18.2.2`
(`asmeb1822` is an equivalent compact alias). Normalized definitions contain
all three boolean properties `iso4032`, `din934` and `asmeb1822`, with exactly
one true. Object inputs may provide those boolean selectors; false values on
unselected families are accepted for schema roundtrips. Disabling the
size-default family without selecting another family fails. Multiple family
flags, repeated flags and legacy `standard(...)` selectors are rejected;
there is no `standard` property in the object contract.

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


## Additional metric and imperial sizes

Use `hexnut_din934_m3` for a DIN 934 regular metric hex nut.
Supported sizes are M1.6, M2, M2.5, M3, M3.5, M4, M5, M6, M7, M8, M10,
M12, M14, M16, M18, M20, M22 and M24. The exported
`hexNutDinDimensions` table owns their coarse pitches and nominal envelopes.
The five previously supported sizes retain their ISO default and released
dimensions. Other metric sizes default to DIN 934; `hexnut_m3` is equivalent
to `hexnut_din934_m3`. An explicit ISO selector remains strict.
DIN and ISO envelopes differ (for example, M10 uses 17 versus 16 mm flats).

Use `hexnut_imperial(1/4-20)` or `hexnut_unc(1/4-20)` for an imperial
regular hex nut. `imperial(1/4)` also selects its coarse pitch. Supported UNC
sizes are #2-56, #4-40, #6-32, #8-32, #10-24, #12-24, 1/4-20,
5/16-18, 3/8-16, 7/16-14, 1/2-13, 5/8-11, 3/4-10, 7/8-9 and 1-8.
Imperial inputs use `imperialSize` in the object API, default
`asmeb1822: true` (string flag `asmeb18.2.2`), right-hand threads and internal class `2B`.
`hexNutImperialDimensions` contains inch envelopes converted using exactly
25.4 mm per inch; `threadPitch` is 25.4 divided by threads per inch.
An explicit TPI or pitch must agree with the tabulated coarse series.
Metric and imperial selectors cannot be combined. `6H` applies to metric
nuts and `2B` to imperial nuts. `threads` and `nothreads` work for both.

The added DIN and ASME tables describe untoleranced regular hex nut visual
models, not heavy hex, jam, flange, locking, or fine-thread nuts. Imperial
across-flats and thickness values use the nominal hex nut and machine screw
nut columns in the [Bolt Depot US Nut Size Table](https://www.boltdepot.com/fastener-information/nuts-washers/US-Nut-Dimensions.aspx).
Fractional sizes select regular hex nuts; numbered sizes select machine
screw nuts. These are nominal visual envelopes, not maximum tolerances or
heavy-hex dimensions. Their bore
mouth diameter is a documented visualization choice of 1.08 times nominal
thread diameter. The existing 30-degree outer chamfers, 90-degree bore
entrances and 60-degree basic internal thread profile are retained, with
all geometry resolved in millimeters and the lower mounting face at Z=0.
Nominal thread class identifies the selected series; manufacturing
allowances and tolerances are not modeled.
