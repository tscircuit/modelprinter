# Timing belt

```text
timingbelt_profile(t5)_shape(openstraight)_teeth20_w10mm
```

A generic, single-sided T5 belt cut to a straight, open length. The supported
selectors are `profile(t5)` and `shape(openstraight)`. No manufacturer-specific
name, endless loop, routing around pulleys, splice, tensile cord, or load rating
is implied. The basic sharp-cornered trapezoid models the belt envelope and
mating tooth dimensions rather than microscopic molded corner radii.

`teeth` / `toothcount` defaults to 20 and accepts integers from 1 through 1024.
`w` / `width` defaults to 10 mm and must be positive. The length is derived
from tooth count times the fixed 5 mm pitch, so independent length/pitch inputs
cannot disagree. Full lengths normalize to millimeters with mm, cm, m, in,
inch, mil, ft, and feet units. Names and selectors are case insensitive.
Unsupported, duplicate, malformed and unknown tokens are rejected.

The T5 basic section has 1.2 mm tooth height, 1 mm backing, 2.65 mm tooth base
width and a 40 degree included flank angle. Tooth tip width is derived as
`2.65 - 2*1.2*tan(20 degrees)` = 1.7764714 mm; catalog illustrations round this
to approximately 1.8 mm. Each actual tooth has two straight flanks and a flat
tip. Total thickness is 2.2 mm. The layout tensile pitch line is 0.425 mm above
the tooth root plane, matching the nominal pulley pitch-line offset. This
geometric line is a datum, not a separately rendered cord or material claim.

Length runs along +X from 0 to `teeth*5`. Width is centered about Y=0. Z=0
is the tensile pitch-line datum; tooth roots lie at Z=-0.425, tips at -1.625,
and the smooth back at +0.575 mm. Teeth face -Z. Tooth centers start at X=2.5
and repeat every 5 mm, ending at length-2.5, leaving 1.175 mm of root-plane
material at each cut end. Default bounds are X=0..100, Y=-5..5, Z=-1.625..0.575.
`getTimingBeltDimensions` is the renderer-independent source of the full
section, length, end margin and datum planes.

References: [SKF's metric timing-belt table](https://gumiimpex.hr/upload/2019/09/skfptpcatalogue_20160422_completecatalogue_en_lowr_5d8c984a017b1.pdf)
and [HPC Europe's DIN 7721 T5 basic-section drawing, page 2](https://www.hpceurope.com/docFichesTechniques/Belts.pdf).
The family name is standard/de-facto T5, not a supplier's branded profile.
