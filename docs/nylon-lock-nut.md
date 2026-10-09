# Nylon lock nut contract

`nylonlocknut_standard(iso7040)_m6` selects ISO 7040:2012, third edition,
Figure 1 and Table 1. `standard(iso7040:2012)` is equivalent and the default.
The [primary dimension table](https://cdn.standards.iteh.ai/samples/61363/a60b58fa5c3b449e81910d0a4b47c7e4/ISO-7040-2012.pdf)
pins the supported preferred M5/M6/M8/M10/M12 sizes. ISO 7040:2025 supersedes
this edition; this contract deliberately remains pinned to 2012 and rejects
other editions. It is an untoleranced nominal visualization, without material
certification or a prediction of locking torque.

The table uses coarse pitch P, maximum across-flats s, maximum total height h,
minimum metal-body height m and maximum bottom bore-mouth diameter da.

| Size | P | s | h | m | da |
| --- | --- | --- | --- | --- | --- |
| M5 | 0.8 | 8 | 6.8 | 4.4 | 5.75 |
| M6 | 1 | 10 | 8 | 4.9 | 6.75 |
| M8 | 1.25 | 13 | 9.5 | 6.44 | 8.75 |
| M10 | 1.5 | 16 | 11.9 | 8.04 | 10.8 |
| M12 | 1.75 | 18 | 14.9 | 10.37 | 13 |

Lengths normalize to mm. A required `m` token chooses the nominal thread;
`threadpitch` may restate its coarse pitch with a number or complete unit
string. `threadclass(6H)` and the value-free `righthanded` flag restate fixed
defaults. `threads`/`nothreads` select thread visibility, defaulting to visible.
Duplicate properties, unsupported sizes/standards, fine pitch, unknown tokens,
inline family arguments, contradictory dimensions and unknown object keys fail.

The axis is Z, bearing face Z=0, top Z=h. Two hex flats lie at y=±s/2.
The regular hexagon is chamfered at both body ends by 30-degree cones with
circular diameter s; the upper chamfer terminates in a cylindrical collar at
Z=m. The collar has diameter s, extends to h, and its outer top edge has a
45-degree chamfer of P/4. There is no washer-face, corner rounding or marking.

The standard leaves the locking feature shape to the manufacturer. This
contract fixes a cylindrical pocket diameter s−2P from Z=m through the top.
The undeformed nylon insert exactly fits this pocket, occupies Z=m…h−P/4,
has a smooth bore D−P/4 and a 45-degree top-bore chamfer of P/8. The insert's
bore is smaller than the nominal mating thread, representing locking
interference without simulating deformation. These pocket/insert dimensions
are model choices, not additional ISO requirements. Their touching interfaces
are internal material boundaries; an assembly mesh can omit those boundaries.

The metal's internal thread occupies Z=0…m. Its single-start, right-hand
60-degree basic profile uses minor diameter D−5√3P/8, internal crest-flat
width P/4, root-flat width P/8 and flank spans 5P/16. Phase is zero at +X,Z=0.
The bottom has a 90-degree countersink from da to the minor diameter; the
threaded body's upper exit has one from D. Both clip the grooves. Hidden
threads use the smooth minor diameter and retain these entrances. No fit
allowance, rolled thread roots or deformation is modeled. `getNylonLockNutDimensions`
resolves all dimensions and datums; jscad-electronics owns geometry and colors.
