# panscrew parameter contract

Implements roadmap #0003 from [issue #13](https://github.com/tscircuit/modelprinter/issues/13).

```ts
mp.string("panscrew_standard(iso7045)_m3_l10mm_drive(phillips)").json()
```

The model pins `iso7045` to **ISO7045:2011**, with M3, M4,
M5 and M6 supported. Other sizes/editions, drives, partial threading, thread
classes other than 6g, and fine pitches are rejected. `iso7045:2011` selects the
same pinned contract explicitly. All normalized lengths are millimeters,
angles are degrees, and the primary metric thread is male, coarse and right-hand.
`threadhand(left)` selects the same profile with opposite handedness.

The [source table](https://cdn.standards.iteh.ai/samples/57372/08630d724c1544b195c2e6bb92cfb888/ISO-7045-2011.pdf)
is pinned by edition and copied into the exported `panScrewDimensions` table.
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

`mN` / `metricsize(mN)` and `l` / `length` are aliases. `standard(...)`,
`drive(...)`, `thread(full)`, `threadhand(...)`, `threadclass(6g)` and
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

ISO 7045:2011 Table 1 uses dk=5.6 mm for M3 and dk=9.5 mm for M5.
Older DIN 7985 tables with 6 mm / 10 mm heads are not used. Nominal maximum
head diameter/height and approximate crown radius rf are fixed to the table.
The head is rotationally symmetric, with a cylindrical lower rim and a
spherical crown of the listed radius, centered on Z. The sphere apex is at
Z=headHeight and meets the outer cylindrical rim continuously. The minimum
under-head blend radius is also pinned. Only fully threaded under-head lengths
up to the standard's minimum thread length b are supported (25 mm for M3,
38 mm for M4/M5/M6). Shorter lengths must exceed the sum of the under-head blend radius and tip chamfer.

The thread axis is Z and the underside of the head is the mounting datum at
Z=0; the shank extends to Z=-length. Type-H cross-recess wings follow X and Y.
The drive is Phillips (type H), rather than Pozidriv (type Z).

The recess is pinned to **ISO 4757:1983**, section 2.1 and Table 1,
[primary reference](https://cdn.standards.iteh.ai/samples/10742/d878fa0371e041b39de75de4d4426928/ISO-4757-1983.pdf).
The exported symbol fields recessB/E/G/F/Radius/T1/Alpha/Beta correspond to
b/e/g/f/r/t1/alpha/beta in that section's drawing. b and g use the stated
nominal limits, e and f use the midpoint of their permitted range, r uses the
nominal value, and alpha/beta use nominal angles. The fixed outer and inner
wing angles are 26.5 and 28 degrees. Recess number is 1 for M3, 2 for M4/M5
and 3 for M6. No extra diagonal type-Z wings are present.

Recess penetration is the ISO 7045 minimum *gauge penetration*, not a depth
measured from the crown apex. It is measured from the intersection of the
recess wings with the spherical crown. The reference plane's height is fixed
by headHeight - crownRadius + sqrt(crownRadius^2 - (recessReferenceDiameter/2)^2)
and returned as recessReferencePlaneHeight. Consumers must construct the
ISO 4757 type-H profile using these symbols and this gauge placement; a
flat-bottom rectangular cross is not the drive interface.
`headd` aliases `headdiameter`.

The symbol token `recesst10.34mm` means `recessT1 = 0.34 mm` (symbol name `recesst1` plus value `0.34mm`); the parser matches this numeric symbol before ordinary alphabetic token names.
