# Button screw parameter contract

`buttonscrew_standard(iso7380-1)_m3_l10mm_drive(hexsocket)` selects ISO
7380-1:2022 (second edition). `standard(iso7380-1:2022)` is equivalent. The
selector defaults to that edition; other editions and drive types are rejected.
The supported coarse-thread sizes are M3, M4, M5 and M6. Sources are ISO
7380-1:2022 Table 1 ([official preview](https://cdn.standards.iteh.ai/samples/78699/a175805085534f98983d6c8aa583a5b0/ISO-7380-1-2022.pdf)) and the reference
thread-length row in [Fuller Fasteners' ISO 7380-1 table](https://fullerfasteners.com/tech/iso-7380-1-specifications-hex-socket-button-head-screws/),
accessed 2026-10-05. Exported `buttonScrewDimensions` pins those values locally.

| Size | Pitch | Head diameter | Head height | Socket across flats | Socket depth | Reference thread length |
| --- | --- | --- | --- | --- | --- | --- |
| M3 | 0.5 | 5.7 | 1.65 | 2 | 1.04 | 18 |
| M4 | 0.7 | 7.6 | 2.2 | 2.5 | 1.3 | 20 |
| M5 | 0.8 | 9.5 | 2.75 | 3 | 1.56 | 22 |
| M6 | 1 | 10.5 | 3.3 | 4 | 2.08 | 24 |

All table lengths are millimeters. Head diameter/height use table maxima,
socket width uses the nominal key size and socket depth uses the table minimum.
This is a deterministic nominal visualization contract, not a tolerance or
loadability certification. The family supports fully threaded short screws:
under-head length must be at least two pitches and at most the tabulated
reference thread length. Lengths are parametric; catalogue length availability
is not claimed. Longer or partially threaded screws require a separate contract.

`m` and `l`/`length` are required. Length inputs accept millimeter numbers or
complete numeric strings with `mm`, `cm`, `m`, `in`, `inch`, `mil`, `ft`, or
`feet`; JSON normalizes them to mm. Selectors `drive(hexsocket)`, `thread(full)`,
`threadhand(right)`, and `threadclass(6g)` have those fixed defaults.
`threadpitch` may explicitly restate the coarse pitch, including equivalent
units; fine pitch is rejected. `threads`/`nothreads` control `showThreads`, which
defaults true. Flags have no value. Duplicate tokens, alias conflicts, malformed
selectors, inline family arguments, unsupported sizes and unknown properties
are errors in both string and strict schema APIs.

The axis is +Z toward the head. The underside bearing plane is z=0, the shaft
runs to z=-length, and the head reaches z=headHeight. The socket is a regular
hexagonal blind prism, two flats parallel to XZ, centered on Z, opening at the
top and ending at topZ-socketDepth. Its floor is flat; broach drill relief and
mouth rounding are omitted. The crown's top flat has table reference diameter
dL. In the (radial r,z) section, connect (headDiameter/2,0) to
(dL/2,headHeight) by the shorter circular arc of table midpoint rf: 3.5, 4.4,
5.5 and 5.9 mm respectively. Of the two possible circle centers choose the one
below and radially inside the rim; `getButtonScrewDimensions` resolves it. Rotate
that arc around Z and cap the crown with the flat. The sharp outer underside is
retained. The under-head fillet uses table minimum rt (0.3, 0.4, 0.45, 0.5 mm): a
quarter-circle centered at (r=diameter/2+rt,z=-rt), tangent to the shaft at
(r=diameter/2,z=-rt) and the bearing face at (r=diameter/2+rt,z=0).

The primary thread is external ISO metric, coarse, single start, right hand,
with a 60 degree basic profile and nominal 6g identity. Use an untoleranced trapezoidal basic profile: major diameter D,
minor diameter D-5*sqrt(3)*pitch/8, pitch diameter D-3*sqrt(3)*pitch/8,
crest flat pitch/8, root flat pitch/4, and axial flank span 5*pitch/16 per
side. These fix a 60 degree thread with sharp flank/flat junctions.
Manufacturing allowance, root rounding and marks are omitted.
Thread phase is zero at the +X radial ray at the tip, winding counterclockwise
as z increases. The first pitch beneath the bearing plane is an incomplete
thread/runout region; its crest tapers linearly from zero thread depth at z=0
to full depth at z=-pitch. The tip has a 45 degree chamfer of radial/axial size
pitch/2. All other radii and chamfers are zero. With `showThreads=false`, retain
a smooth nominal major-diameter shaft, the tip chamfer and the head/socket.
`getButtonScrewDimensions` returns envelope dimensions and datum Z values without
creating geometry. Rendering belongs in jscad-electronics.
