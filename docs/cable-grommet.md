# Cable grommet model strings

```
cablegrommet_panelhole20mm_id10mm_od24mm_h8mm_groovew3mm_grooved2mm_shape(symmetricring)
```

This custom nominal protection ring uses two equal circular flanges and a
centered annular panel groove. It selects no supplier series or dimensional
standard. `shape(symmetricring)` is the sole shape and defaults when omitted.
The six dimensions are required; no physical size is inferred.

| Token | Property | Meaning |
| --- | --- | --- |
| `panelhole` | `panelHoleDiameter` | Installed panel hole / groove root diameter |
| `id` | `innerDiameter` | Constant through bore diameter |
| `od` | `outerDiameter` | Diameter of both flanges |
| `h` | `height` | Overall axial height |
| `groovew` | `grooveWidth` | Axial groove width / nominal panel thickness |
| `grooved` | `grooveDepth` | Radial groove depth, not a diametral reduction |

The lowercase property spellings in the table also work as string tokens. All
lengths accept numbers in millimeters or unit strings (`mm`, `cm`, `m`, `in`,
`inch`, `mil`, `ft`, `feet`) and normalize to millimeters. Tokens, aliases, and
selectors are case insensitive. Repeated properties and unknown tokens fail.

The ring axis is Z. Its origin is the bore center in the panel midplane. The
body spans `-height/2 .. +height/2`; the groove spans
`-grooveWidth/2 .. +grooveWidth/2`. The outer radius is `outerDiameter/2` outside
the groove and `(outerDiameter - 2 * grooveDepth)/2` within it; the inner radius
is always `innerDiameter/2`. Groove shoulders and end faces are planar and perpendicular
to Z, with zero chamfers and edge radii. The ring is continuous and unsplit,
with no lips, taper, stretch, or installed deformation. Its nominal panel
interface is a centered, straight cylindrical hole with thickness `grooveWidth`.

Validation requires `ID < panelhole < OD`, `groovew < h`, and
`panelhole = OD - 2 * grooved` (numerical tolerance `1e-9 * OD`). This leaves a
positive wall at the actual groove root and two flanges
of thickness `(h - groovew)/2`. `getCableGrommetDimensions` exposes these derived
dimensions. OD and groove depth define the actual groove root; the supplied
panel hole is checked against it with the stated floating-point allowance.
Schemas reject unknown properties, incomplete lengths, nonfinite
values, zero dimensions, and incompatible geometry.

This repository defines the parameter contract. Geometry belongs in
`tscircuit/jscad-electronics`.
