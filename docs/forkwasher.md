# Fork washer

`forkwasher_slotw6.5mm_slotl18mm_w20mm_l25mm_h2mm`

A rectangular washer with a centered slot that opens at Y=0 and ends in a
semicircular root. The blank is centered on X, runs from Y=0 to `length`
and extends from Z=0 to `thickness`. The slot length runs from its entry to
the deepest point of the semicircle, whose radius is half the slot width.

| Property | Token | Meaning |
| --- | --- | --- |
| `slotWidth` | `slotw` | Width of the opening |
| `slotLength` | `slotl` | Total slot depth, including the rounded root |
| `width` | `w` | Blank width |
| `length` | `l` | Blank length along the slot |
| `thickness` | `h`, `t` | Axial thickness |

All dimensions are required and normalize to millimeters. Short tokens and
full property names are case insensitive. Aliases cannot repeat a property.
The slot must retain straight sides, a distinct rounded root and material
on both sides and behind its root. `getForkWasherDimensions` reports the root,
minimum side and rear walls, and the outer envelope.

[Roadmap item 0638](https://github.com/tscircuit/modelprinter/issues/13#issuecomment-5977316769)
