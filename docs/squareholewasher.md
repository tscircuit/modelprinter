# Square-hole washer

`squareholewasher_holew6mm_od18mm_h2mm`

A round washer with a centered square opening. The sides of the opening are
parallel to the X and Y axes. The washer extends from Z=0 to Z=`thickness`.

| Property | Token | Meaning |
| --- | --- | --- |
| `holeWidth` | `holew` | Width between opposite sides of the opening |
| `outerDiameter` | `od` | Outside diameter |
| `thickness` | `h`, `t` | Axial thickness |

All three lengths are required and normalize to millimeters. Short tokens and
full property names are case insensitive. An alias cannot repeat a property.
The opening diagonal must be smaller than the outside diameter, leaving a
positive radial wall at each corner. `getSquareHoleWasherDimensions` returns the
diagonal, minimum radial wall and envelope in millimeters.

[Roadmap item 0633](https://github.com/tscircuit/modelprinter/issues/13#issuecomment-5977316769)
