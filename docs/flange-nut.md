# Flange nuts

`flangenut_m6_plainface` selects a right-hand, coarse through thread and a smooth
flange bearing face using ISO 4161:2012 by default. The optional value-free flag
`flangenut_iso4161_m6_plainface` produces the same normalized contract. The old
`standard(...)` selector is unsupported. Supported designations are
M5, M6, M8, M10, M12, M14, M16 and M20. M14 is the edition's discouraged size.
The value-free flags `plainface`, `righthanded`, `threads` and `nothreads` are
optional. Repeated flags, both visibility flags, unknown tokens, inline function
arguments, other standards, serrated faces and dimensional overrides fail.

The public props and definition schemas are strict. Lengths normalize to mm;
an explicit `threadPitch` must equal the tabulated coarse pitch. String pitches
accept complete decimal lengths with mm, cm, m, in, inch, mil, ft or feet units.
The schemas preserve normalized `iso4161: true`, `plainFace: true`, `rightHanded: true`,
`threadClass: "6H"` and `showThreads`; contradictory JSON values fail. Thread
class identifies the selected series without applying its manufacturing
allowances or tolerances.

Dimensions come from [ISO 4161:2012, Table 1, page 3](https://cdn.standards.iteh.ai/samples/61523/6933d05d5928493fa0aaa091527bed78/ISO-4161-2012.pdf).
The contract uses maximum across-flats s, total height m, flange diameter dc and
bore-mouth diameter da, and coarse pitch P. The table's minimum c, dw and mw
are exported as minimumFlangeThickness, minimumBearingDiameter and
minimumWrenchingHeight. For M6 these are s=10, m=6, dc=14.2, da=6.75, P=1,
c=1.1, dw=12.2 and mw=3.1 mm. In particular, M10 uses 15 mm across flats.

`getFlangeNutDimensions` defines an untoleranced nominal visual contract:

- The axis is +Z. The entire flat flange bearing annulus lies at Z=0; total
  height includes the flange, and the upper face lies at Z=m.
- The flange has a cylindrical outer rim of radius dc/2 and height c-min.
  Its upper taper rises inward at 20 degrees to the horizontal until it
  intersects the hexagon. Thus its thickness at dw-min exceeds c-min.
  The bearing face extends to dc/2. The optional edge contour is square.
- The hexagon has flats parallel to X, one flat at Y=s/2. Its upper chamfer
  makes 30 degrees to the horizontal and ends in a circular face of diameter s.
  Flange/hex intersections are sharp (transition radius zero); no unspecified
  manufacturer fillets, edge rounding or serrations are inferred.
- Both bore entrances use 90-degree included cones of diameter da. The internal
  thread is a basic 60-degree right-hand profile with minor diameter
  D - 5*sqrt(3)*P/8, 1/4-pitch crest flats and 1/8-pitch root flats. Its phase is
  zero at angle zero and Z=0; entrances trim the thread. `nothreads` retains the
  minor bore and both mouths. There is no additional runout.

This visual model does not certify ISO gauging, material strength, coating,
thread fit, property class or production tolerances. Geometry generation and
four-view snapshots belong to jscad-electronics.
