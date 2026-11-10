# Torsion bar

`torsionbar_d10mm_l150mm_hexends_endaf12mm_endl20mm_transition5mm`

A round bar with two aligned hexagonal ends and equal coaxial transitions.
The bar is centered in XY and extends from Z=0 to Z=`length`. Each end has
two flats normal to X. From either tip, the hex section spans `endLength`
and the transition spans `transitionLength` before reaching the round section.

| Property | Token | Meaning |
| --- | --- | --- |
| `diameter` | `d` | Round section diameter |
| `length` | `l` | Overall length |
| `hexEnds` | `hexends` | Value-free flag, defaults to true |
| `endAcrossFlats` | `endaf` | Hex width between opposite flats |
| `endLength` | `endl` | Length of each hex section |
| `transitionLength` | `transition` | Length of each transition |

Lengths are required and normalize to millimeters. Both short tokens and full
property names are case insensitive. Aliases for the same property can appear
only once. The overall length must exceed twice the combined end and transition
length, and each section must have distinct axial coordinates.
`getTorsionBarDimensions` returns those coordinates, the middle span and the
envelope in millimeters.

[Roadmap item 0786](https://github.com/tscircuit/modelprinter/issues/13#issuecomment-5977316769)
