# Deep-groove radial ball bearing

`ballbearing608` expands to
`ballbearing_id8mm_od22mm_w7mm_bothsidesopen`. Supported conventional envelope
codes are 608 (8 × 22 × 7), 625 (5 × 16 × 5), 624 (4 × 13 × 5),
6000 (10 × 26 × 8), 6001 (12 × 28 × 8), and 6002 (15 × 32 × 9), in mm.
They are bearing designations associated with the [ISO 15 boundary-dimension
system](https://www.iso.org/search.html?q=ISO%2015). Internal geometry is nominal.

| Suffix | Top face | Bottom face |
| --- | --- | --- |
| none | open | open |
| Z | open | metal shield |
| ZZ or 2Z | metal shield | metal shield |
| RS | open | generic seal |
| 2RS | generic seal | generic seal |

For example, `ballbearing625zz` expands to
`ballbearing_id5mm_od16mm_w5mm_bothsidesshielded`.
`ballbearing625zz_topsideopen` expands to
`ballbearing_id5mm_od16mm_w5mm_topsideopen_bottomsideshielded`.
`ballbearing6002rs` means code 6002 plus RS; `ballbearing60022rs` means code
6002 plus 2RS. Suffixes imply no vendor-specific seal contact, material grade,
lubrication, preload, tolerances or load ratings.

Value-free flags are `_open`/`_bothsidesopen`, `_shielded`/`_bothsidesshielded`,
`_sealed`/`_bothsidessealed`, and `_topsideopen`, `_topsideshielded`,
`_topsidesealed`, `_bottomsideopen`, `_bottomsideshielded`, `_bottomsidesealed`.
Explicit global flags override suffix defaults. Face-specific flags override
those globals independent of order. Repeated or conflicting flags within the
same scope are errors. `closure(open)` is not accepted.

Custom envelopes use `ballbearing_id6mm_od20mm_w6mm_open`; dimensions default
independently to 8/22/7. Long aliases `innerdiameter`, `outerdiameter`, `width`
and the explicit `code608` token also work. A code supplies omitted dimensions;
provided dimensions must match it after conversion. Bore must be positive and
smaller than outside diameter; width must be positive. Complete unit strings
accept mm, cm, m, in, inch, mil, ft and feet, case insensitive. Unknown,
partial, empty or repeated tokens and exponent notation are rejected.

`mp.string(source).params().string` exposes the canonical expanded string;
`.json()` returns dimensions and six boolean face flags, with exactly one true
per face. The code and shorthand selectors are resolved out of normalized data.
Direct strict schemas accept `code`, lengths, the six face flags and optional
`bothSidesOpen`/`bothSidesShielded`/`bothSidesSealed` selectors. All-false explicit
face selections and conflicting true selectors fail. Normalized output parses
idempotently through both the model-specific and root definition schemas.

The shaft axis is Z, centered on X/Y=0. Bottom is Z=0, top is Z=width, and balls
lie at Z=width/2 with the first of eight on +X. `getBallBearingDimensions`
owns the visualization's ball radius, pitch, grooves, chamfers, cage and cover
thickness. The renderer rejects dimensions below its numerical resolution.
