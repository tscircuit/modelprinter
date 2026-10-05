# Flexible hose model strings

```
flexiblehose_id6mm_od9mm_l100mm_shape(straight)_wall(smooth)_ends(cut,cut)
```

This custom nominal hose has a constant circular bore and a concentric smooth
outer wall in its straight, undeformed pose. It selects no supplier series,
pressure rating, or dimensional standard. `shape(straight)`, `wall(smooth)`,
and `ends(cut,cut)` are the only supported selectors and are defaults when
omitted. ID, OD, and length are required; material flexibility does not change
the nominal geometry.

| Token | Property | Meaning |
| --- | --- | --- |
| `id` | `innerDiameter` | Through-bore diameter |
| `od` | `outerDiameter` | Outside diameter |
| `l` | `length` | End-to-end axial length |
| `shape(...)` | `shape` | `straight` |
| `wall(...)` | `wall` | `smooth` |
| `ends(...,...)` | `ends` | Ordered end construction, `cut,cut` |

The lowercase property spellings also work as length tokens. Tokens and
selectors are case insensitive. Lengths accept numbers in millimeters or
unit strings (`mm`, `cm`, `m`, `in`, `inch`, `mil`, `ft`, `feet`) and normalize
to millimeters. Repeated properties, including mixed aliases, are errors.

The hose axis is +Z. The origin is the bore center on the first end face;
the first cut is at Z = 0 and the second at Z = length. Both open end faces
are flat annuli perpendicular to Z, with zero chamfer and edge radius. The
material occupies radii `ID/2 .. OD/2` throughout that interval, so wall
thickness is `(OD - ID)/2`. The end bores are the installation interfaces for
user-specified mating fittings. No end fittings, flares, corrugation, taper,
internal reinforcement, or collapsed/bent state is inferred.

All dimensions must be positive and finite and `ID < OD` must leave positive
wall thickness. `getFlexibleHoseDimensions` returns the radii, wall thickness,
and end datums. The direct schemas are strict and reject unsupported shapes,
walls, end types, unknown properties, and incomplete numeric length strings.

This repository owns the parameter contract; geometry generation belongs in
`tscircuit/jscad-electronics`.
