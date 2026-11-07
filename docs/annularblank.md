# Annular blank

`annularblank_od80mm_id40mm_t10mm_rimr0mm` describes a ring-shaped machining
blank with an open through-bore. It is centered at the XY origin, with its axis
along Z, bottom face at Z=0 and top face at Z=thickness.

| Property | Tokens | Meaning |
| --- | --- | --- |
| `outerDiameter` | `od`, `outerdiameter` | Overall outside diameter; required, positive |
| `innerDiameter` | `id`, `innerdiameter` | Bore diameter at the straight cylindrical wall; required, positive |
| `thickness` | `t`, `thickness` | Overall distance between end planes; required, positive |
| `rimRadius` | `rimr`, `rimradius` | Equal quarter-circle fillet radius at all four circular bore/outside rims; defaults to 0 (sharp edges) |

Lengths normalize to millimeters. Tokens and units are case insensitive; token
order is unrestricted. Complete decimal lengths accept `mm`, `cm`, `m`, `in`,
`inch`, `mil`, `ft` and `feet`, or no unit (millimeters). Repeated properties,
including their aliases, unknown tokens and malformed lengths are rejected.

The outside diameter must exceed the bore diameter. For radial width
`W = (outerDiameter - innerDiameter) / 2`, the radius must satisfy `2r < W` and
`2r < thickness`. These strict limits preserve a flat annular area on each end
and positive straight wall height on both cylinders. The bore radius, radial
width and flat face diameter separation must remain positive in numeric output.

`getAnnularBlankDimensions` validates its input and returns normalized properties,
inner/outer radii, radial width, flat face inner/outer diameters, flat face width,
straight wall height, `size: [outerDiameter, outerDiameter, thickness]`, `bottomZ`
and `topZ`. For OD=80, ID=40, thickness=10 and radius=2, the flat face spans
diameters 44 to 76, its radial width is 16 and straight wall height is 6. The
overall envelope remains 80 by 80 by 10.

This contract does not add chamfers, slots, threads, taper, material properties
or manufacturing tolerances. Geometry generation belongs in `jscad-electronics`.

Roadmap: [modelprinter #13, item 0262](https://github.com/tscircuit/modelprinter/issues/13#issuecomment-5977315678).
