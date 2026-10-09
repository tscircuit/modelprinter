# Round spacer

`spacer_id3.2mm_od6mm_l10mm_round_chamfer0.3mm` describes an unthreaded round
spacer with a 3.2 mm through bore, a 6 mm outside diameter and a 10 mm overall
length. Its lower end is Z=0 and its upper end is Z=length. This explicit
parametric envelope does not claim a manufacturing standard or fit tolerance.

`id`/`innerdiameter`, `od`/`outerdiameter`, and `l`/`length` are required lengths.
Numeric values use millimeters; unit-bearing values normalize to millimeters.
`round` is a value-free flag and defaults to true. `chamfer`/`edgechamfer` defaults
to zero and cuts all four bore/outside rims at 45 degrees, with equal radial and
axial setbacks. Overall length and diameters refer to the uncut envelope.

The outside diameter must exceed the bore. Chamfers must leave both an annular
end face and a positive straight section: `chamfer < (od-id)/4` and
`chamfer < length/2`. Unknown fields, malformed lengths and duplicate aliases
are rejected. The public schemas expose input/output types, and
`getSpacerDimensions` returns the envelope, end opening diameters, straight
length, wall thickness and placement datums. Meshes and snapshots belong to
jscad-electronics.
