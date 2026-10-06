# T-slot extrusion

```text
tslotextrusion_w20mm_h20mm_l100mm_profile(fourtsolid)_slot6mm_pocket10mm_pocketd2mm_lip2mm_bore4mm_corner1mm
```

`fourtsolid` is an explicitly dimensioned custom solid rectangular extrusion,
with four identical straight-sided T grooves and an optional axial round bore.
It does not select a supplier's 2020 profile or imply internal lightening holes.
The square roadmap example is one instance; unequal width and height are allowed.

| Token | JSON property | Default (mm) |
| --- | --- | --- |
| `w`, `width` | `width` | 20 |
| `h`, `height` | `height` | 20 |
| `l`, `length` | `length` | 100 |
| `profile(...)` | `profile` | `fourtsolid` |
| `slot`, `slotwidth` | `slotWidth` | 6 |
| `pocket`, `pocketwidth` | `pocketWidth` | 10 |
| `pocketd`, `pocketdepth` | `pocketDepth` | 2 |
| `lip`, `lipthickness` | `lipThickness` | 2 |
| `bore`, `borediameter` | `boreDiameter` | 0 (no bore) |
| `corner`, `cornerradius` | `cornerRadius` | 0 |

The local mounting datum is the center of the end face at Z=0. X is width,
Y is height, and the extrusion runs along +Z to `length`. The section spans
X=±width/2 and Y=±height/2. Each groove is centered on its exterior face;
the grooves on ±X run inward along X and those on ±Y along Y. All four run
through the entire length and open on both end faces.

Each groove has a rectangular neck of width `slotWidth`, extending inward from
the outer face by `lipThickness`, followed by a rectangular pocket of width
`pocketWidth` and further depth `pocketDepth`. Groove transitions have sharp
corners. `cornerRadius` rounds only the four outside section corners, along Z.
The bore is centered on X=Y=0 and passes through the full length. Both end faces
are flat, with zero end chamfers. No threads, fillets, coatings or tolerances are
implied. Every omitted fitting feature is fixed by this contract.

Lengths accept finite numbers in millimeters or complete strings with supported
units (`mm`, `cm`, `m`, `in`, `inch`, `mil`, `ft`, `feet`), normalized to mm.
Parameters cannot repeat, including aliases. Unknown tokens and profile names
are errors. Direct props and definitions are strict schemas with the same rules.
The pocket must be wider than the opening; adjacent pockets, the bore, and the
outside corner regions must retain positive separating material. The corner
region check conservatively reserves `cornerRadius` beside each pocket.

The exported `getTSlotExtrusionDimensions` validates inputs and returns total
groove depth, bore depth/axis, groove face identities and minimum wall between
the bore and a pocket. Geometry generation belongs in jscad-electronics.
