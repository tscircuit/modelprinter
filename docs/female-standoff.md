# Female hex standoff

`femalestandoff_m3_af5.5mm_l10mm_hex_threadedthrough` describes a generic M3
female standoff with a hexagonal body, 5.5 mm across flats and 10 mm body length.
The mounting faces lie at Z=0 and Z=length. A single internal threaded bore
passes through both faces. It does not imply a manufacturer's mounting-hole,
material or tolerance specification.

The bare name defaults to this M3 envelope, right-hand coarse 0.5 mm pitch,
visible threads and 0.2 mm outer end chamfers. `_hex` and `_threadedthrough`
explicitly select the supported shape and through bore. Blind or round variants
are not supported. `_m2`, `_m2.5`, `_m3`, `_m4`, `_m5`, `_m6`, `_m8`, `_m10` and
`_m12` use ISO metric coarse pitch defaults and generic across-flats defaults
from `femaleStandoffMetricDimensions`; body length defaults to 10 mm.

`_af`/`_acrossflats`, `_l`/`_length`, `_p`/`_threadpitch`, and `_endchamfer`
accept positive plain decimal lengths in millimeters or mm, cm, m, in, inch,
mil, ft and feet. End chamfer also accepts zero. A fine pitch may be explicit;
pitch cannot exceed one third of the major thread diameter. `_lefthand` or
`_righthand` selects handedness, and `_threads` or `_nothreads` controls thread
visibility. Conflicting/repeated flags and duplicate aliases are rejected.

The thread uses a nominal 60-degree visual profile with minor diameter
`D - 5*sqrt(3)*P/8`. Bore mouths are 1.08D with 45-degree lead-ins; outer body
edges have equal axial/radial 45-degree setbacks. The default outer chamfer is
at most 0.2 mm, one quarter of body length and one eighth of the remaining
radial envelope. Validation preserves an annular end face and positive straight
body/thread length. These are visual dimensions, not manufacturing tolerances.

`getFemaleStandoffDimensions` exposes the major/minor/mouth diameters,
across-flats/corners, chamfers and Z datums for renderers. Modelprinter owns all
these dimensions; geometry lives in jscad-electronics.
