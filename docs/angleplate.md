# Angle plate

The `angleplate` contract implements the dimensioned right-angle mounting plate
in [roadmap item 0176](https://github.com/tscircuit/modelprinter/issues/13).

```ts
mp.string(
  "angleplate_w100mm_h100mm_d80mm_t12mm_innerr0mm_baseholes4_hole8mm_pitchx70mm_pitchy50mm_faceholes2_facepitch60mm_facez50mm",
).json()
```

All dimensions are required and normalize to millimeters. `w`, `h`, `d`, and
`t` are the overall width, height, depth, and uniform plate thickness. `innerr`
is the concave inside-corner radius; outside edges remain square. `hole` is the
diameter of all six circular through-bores. This family supports the specified
four base holes (`baseholes4`) and two upright holes (`faceholes2`). Other counts
are rejected rather than assigned an unspecified pattern.

The right-handed local frame has X from `-width/2` to `width/2`, Y from zero to
`depth`, and Z from zero to `height`. The horizontal base occupies
`Z=0..thickness`, and the upright occupies `Y=0..thickness`. The four base holes
run along Z on a centered `pitchx` by `pitchy` grid. The grid is centered in the
flat base between `Y=thickness+innerRadius` and `Y=depth`, avoiding the upright
and inner fillet. The two upright holes run along Y at `X=+-facepitch/2` and
`Z=facez`. Hole centers returned by `getAnglePlateDimensions` lie halfway through
their respective plate thicknesses.

For the roadmap example the base centers are `(+-35, 21, 6)` and
`(+-35, 71, 6)`, and upright centers are `(+-30, 6, 50)`. Validation requires
positive material between holes, at all edges, and around the inside corner.
Touching or overlapping bore boundaries, duplicate aliases, unknown tokens,
missing dimensions, and nonfinite derived dimensions are rejected.

The public exports are `anglePlateModelPropsSchema`,
`anglePlateModelDefinitionSchema`, `AnglePlateModelPropsInput`,
`AnglePlateModelProps`, `AnglePlateModelDefinition`, and
`getAnglePlateDimensions`. Geometry generation belongs in jscad-electronics;
this contract does not claim a rendered or manufactured component.
