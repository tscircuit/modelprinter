# Generic sleeve linear ball bearing

`linearballbearing_bore8mm_od15mm_l24mm_seals(both)` describes a generic
8 mm shaft-contact bore, 15 mm outside diameter and 24 mm overall length.
Defaults are exactly those dimensions and two end seals. Specifying bore
10 mm or 12 mm supplies omitted OD/length as 19 × 29 mm or 21 × 30 mm,
respectively. These are common de-facto industry sleeve envelopes often
identified by LM8UU/LM10UU/LM12UU, but the model has no manufacturer or LM
selector and does not claim that a designation specifies its internal parts.
A different bore requires explicit outside diameter and length.

Tokens are `bore`/`id`/`borediameter`, `od`/`outerdiameter`, `l`/`length`, and
`seals(both)`. Both seals are the only supported configuration. All lengths
must be positive, OD must exceed bore, and length must leave a positive
straight track between the nominal relieved end chambers. Strict schemas
and parsers reject extra properties, unknown/duplicate aliases, malformed
options, partial numeric values and nonfinite numbers. Units are mm by
default; complete mm/cm/m/in/inch/mil/ft/feet strings are supported.

Axis Z is the shaft travel direction; the end planes are Z=0 and Z=length,
with X/Y center at the origin. The bore is the minimum radial shaft-contact
diameter, not the sleeve's larger metal inner wall. Six loaded rows start
on +X and repeat every 60 degrees; six return rows are offset 30 degrees.
Metal raceway grooves, polymer pocket separators, two end retainers and
balls in the end chambers form a nominal recirculating assembly. The helper
owns all ball spacing, return-chamber and cage dimensions. Internal ball
count, groove profile, end-turn representation and seals are visualization
choices, not ISO 10285 tolerances, load ratings, preload or supplier internals.
The bore remains open throughout. There are no mounting holes or threads.
