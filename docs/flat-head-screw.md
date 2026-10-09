# flatheadscrew parameter contract

Implements roadmap #0002 from [issue #13](https://github.com/tscircuit/modelprinter/issues/13).

```ts
mp.string("flatheadscrew_m3_l10mm_drive(hexsocket)").json()
```

The model defaults to **ISO10642:2019**, with M3, M4, M5 and M6 supported.
The optional value-free `_iso10642` flag explicitly selects the same default;
both forms normalize to `iso10642: true`. Legacy `standard(...)` selectors,
other sizes/editions, drives, partial threading, thread classes other than 6g,
and fine pitches are rejected. All normalized lengths are millimeters,
angles are degrees, and the primary metric thread is male, coarse and right-hand.
`threadhand(left)` selects the same profile with opposite handedness.

The [source table](https://www.westfieldfasteners.co.uk/Standards/ScrewBolt-SHCsk-M.html)
is pinned by edition and copied into the exported `flatHeadScrewDimensions` table.
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

ISO 10642 heads are larger than DIN 7991; the M3 values are **6.72 mm** head
diameter and **1.86 mm** height. This contract uses theoretical maximum head
diameter dk, maximum height k, nominal socket across flats s and minimum usable
socket depth t from the pinned table. It does not substitute DIN 7991 values.

The axis is local Z and the flush head top is the mounting datum at Z=0.
Length is overall length including the head: the tip is at Z=-length and the
90-degree cone extends to Z=-headHeight. The chosen sharp conical envelope
uses dk and k; the listed minimum under-head blend radius joins the shank.
The centered flat-bottom hex socket extends downward from Z=0, with a pair
of socket flats parallel to X. Socket-mouth chamfer and drill-point relief
are omitted. `socketaf` / `socketacrossflats`, `socketh` / `socketdepth`, and
`headd` / `headdiameter` are aliases.

Only full-thread shanks within reference thread length b are supported:
length - headHeight <= maximumThreadLength. Overall length must leave a shank
beyond the head, under-head blend radius, and fixed tip chamfer. Longer screws need a future explicit
partial-thread contract; they do not silently get an invented smooth shank.
