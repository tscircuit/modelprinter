# hexbolt parameter contract

Implements roadmap #0001 from [issue #13](https://github.com/tscircuit/modelprinter/issues/13).

```ts
mp.string("hexbolt_m6_l25mm_thread(full)_drive(hex)").json()
```

The model pins `iso4017` to **ISO4017:2014**, with M3, M4,
M5 and M6 supported. Other sizes/editions, drives, partial threading, thread
classes other than 6g, and fine pitches are rejected. The ISO table applies by
default; optional `_iso4017` restates it and normalizes to `iso4017: true`.
The flag accepts no value, and schemas default it to true. Legacy `standard(...)`
selectors and the `standard` property are unsupported. All normalized lengths are millimeters,
angles are degrees, and the primary metric thread is male, coarse and right-hand.
`threadhand(left)` selects the same profile with opposite handedness.

The [source table](https://cdn.standards.iteh.ai/samples/63206/dd63a69c4be3432aac1914bccda73b2c/ISO-4017-2014.pdf)
is pinned by edition and copied into the exported `hexBoltDimensions` table.
Nominal major diameter and coarse pitch are used. Basic pitch and minor thread
diameters follow the ISO metric 60-degree profile: H = sqrt(3)*P/2,
d2 = d - 3H/4 and d3 = d - 17H/12. The terminal 45-degree chamfer has axial and
radial size P/2, a fixed nominal choice for the permitted chamfered end.
Thread-root rounding, runout, tolerance deviations and markings are omitted;
thread visibility is independent of thread identity.

The thread is a single-start helix. Its nominal, unchamfered crest centerline
crosses +X at the tip plane Z=-length; this fixes phase before the terminal
chamfer trims the profile. For right-hand threads, angle increases
counterclockwise from +X toward +Y as Z increases, with one revolution per
threadPitch. Left-hand threads reverse the angular progression. The axial
profile uses major diameter `diameter`, pitch diameter `threadPitchDiameter`,
and root diameter `threadRootDiameter`. Root rounding is replaced by a flat:
each pitch contains a crest flat of P/8, two 60-degree flanks with axial span
17P/48 each, and a root flat of P/6. These widths total P and give the returned
d3 = d - 17H/12 root diameter. `showThreads: false` renders a smooth shank at
the major diameter, retaining the same head, under-head blend, tip chamfer,
length and thread identity.

`mN` / `metricsize(mN)` and `l` / `length` are aliases. `drive(...)`, `thread(full)`, `threadhand(...)`, `threadclass(6g)` and
`threadgender(male)` are selectors. `threads` / `nothreads` set visibility.
Dimensional fields in the table can be repeated explicitly using their
lowercase field names (for example `threadpitch0.5mm`), or supplied through the
public schema. They must equal the pinned value; they cannot redefine the
selected standard. `d` / `diameter` and `headh` / `headheight` are aliases.
Lengths accept numeric millimeters or complete decimal unit strings in the public schema; trailing junk, exponent notation, and leading/trailing whitespace are rejected.
String dimensions accept decimal values with mm, cm, m or in (also inch);
exponents and trailing junk are rejected. Integer/angle fields use unitless
numeric strings. Duplicate properties, including aliases, and unknown tokens
or schema properties are rejected. `fn` is required in definitions and excluded
from the props schema. Definition output can be revalidated by the public
model union without losing its dimensions.

There are no translations or rotations in this family contract. Place and
orient the normalized component in the consuming assembly. Geometry belongs
in jscad-electronics, which must consume this package's dimensions and defaults.

The screw axis is local Z. The flat underside of the head is the assembly
mounting datum at Z=0, the shank extends to Z=-length and the head occupies
0 <= Z <= headHeight. One pair of hex flats is parallel to X, at
Y=+/-headAcrossFlats/2. The head uses a regular hexagon with nominal across-flats
and nominal height from ISO 4017:2014 Table 1; the under-head blend uses the
listed minimum radius. Its top rotational chamfer is a cone at 30 degrees to
the XY plane, meeting a circular top face of diameter headAcrossFlats. The
head corner diameter is 2*headAcrossFlats/sqrt(3). The underside is the permitted
plain bearing-face form, without a separate washer-face extrusion.
`af` aliases `headacrossflats`. Length is under-head length and must leave a
positive straight shank between the under-head fillet and tip chamfer.
