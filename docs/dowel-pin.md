# ISO 8734 dowel pin

`dowelpin_d3mm_l10mm`

This contract defaults to a nominal visualization pinned to **ISO 8734:1997**, second edition, Figure 1 and Table 1. The primary source is the [ISO preview](https://cdn.standards.iteh.ai/samples/20002/ba95529de6a64437ac7454e14dbd2ef6/ISO-8734-1997.pdf). Figure 1 appears on printed page 1 / PDF page 3, and Table 1 on printed page 2 / PDF page 4. The optional value-free `_iso8734` flag makes that same contract explicit: `dowelpin_iso8734_d3mm_l10mm` produces identical dimensions and normalized JSON. The boolean `iso8734` property always resolves to `true`; false or valued flags, repeated flags, other standards and the former `standard(...)` selectors or `standard` property are rejected.

`d`/`diameter` and `l`/`length` are required positive unit-bearing dimensions. Length is the overall distance between the flat end planes at Z=0 and Z=length, including both end leads. Supported nominal diameters and approximate axial lead lengths c, in millimeters, are:

| d | 1 | 1.5 | 2 | 2.5 | 3 | 4 | 5 | 6 | 8 | 10 | 12 | 16 | 20 |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| c | 0.2 | 0.3 | 0.35 | 0.4 | 0.5 | 0.63 | 0.8 | 1.2 | 1.6 | 2 | 2.5 | 3 | 3.5 |

Supported tabulated nominal lengths through 100 mm are 3, 4, 5, 6, 8, 10, 12, 14, 16, 20, 22, 24, 26, 28, 30, 32, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95 and 100. Length must exceed 2c to leave a cylindrical middle. The supported value sets are a visual parameter domain, not a claim that every diameter/length combination is a standard commercial product.

For deterministic geometry, both end leads are conical, use the Figure 1 approximate 15-degree angle to the pin axis, and terminate in flat circular disks. End diameter is d-2c tan(15°); for d=3 mm, c=0.5 mm and end diameter is approximately 2.73205 mm. The standard permits optional rounded or dimpled manufacturer ends; this renderer chooses the flat-ended visual convention. It does not certify m6 fit, material, hardness, surface finish, end variations or manufacturing tolerances.

`c`/`endleadlength` and `endleadangle` may state the pinned values explicitly; contradictory overrides are rejected. Unknown tokens, duplicate aliases and unsupported dimensions are rejected. Modelprinter owns this contract; jscad-electronics owns geometry and snapshots.
