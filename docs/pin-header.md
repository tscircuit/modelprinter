# Male pin header (roadmap 0134)

`mp.string("pinheader_p2.54mm_n6_rows2_gender(male)_w7.62mm_d5.08mm_bodyh2.54mm_above6mm_below3mm_pin0.64mm_mount(throughhole)_axis(vertical)").json()` defines an unshrouded straight 2×3 male header with **six total pins**, not six pins per row. This is a documented custom nominal construction; no vendor identity or mating connector standard is implied. Geometry belongs in jscad-electronics.

The flat mounting face of the rectangular insulator is at Z=0, with X along its width/columns, Y along its depth/rows, and body height along +Z. All dimensions normalize to millimeters. Let C=pinCount/rows. Pin centers are at X=(column−(C−1)/2)×pitch and Y=(row−(rows−1)/2)×pitch for zero-based indices. The example centers are X=−2.54,0,+2.54 and Y=−1.27,+1.27 mm. Pins have constant square cross-section of side `pinWidth`, faces parallel to X/Y, and flat ends. They run from Z=−belowLength through the body to Z=bodyHeight+aboveLength. There are no bevels, shrouds, keys, shoulders, retention barbs, holes, or omitted electrical contacts. Insulator surfaces are flat, with zero corner radius. No electrical pin numbering or signal assignments are inferred.

| Property | Tokens | Default |
| --- | --- | --- |
| pitch | p/pitch | 2.54 |
| pinCount | n/pincount | 6 |
| rows | rows | 2 |
| width, depth, bodyHeight | w/width, d/depth, bodyh/bodyheight | 7.62, 5.08, 2.54 |
| aboveLength, belowLength | above/abovelength, below/belowlength | 6, 3 |
| pinWidth | pin/pinwidth | 0.64 |
| gender, mount, axis | gender(male), mount(throughhole), axis(vertical) | male, throughhole, vertical |

Pin count must be a positive integer up to 1000, divisible by the positive row count (up to 100). Pins must be narrower than pitch. Width and depth must strictly exceed the respective array spans including square-pin width, leaving positive insulator margins. Changing count or pitch does not automatically resize the insulator: provide matching width/depth for larger arrays. Every length must be finite and positive. Unknown properties/tokens, missing values, inline counts, duplicate aliases, and unsupported selectors are rejected. Compact strings are case-insensitive; direct schema properties use the names/literals above. Public props/definition schemas and input/output types are exported.
