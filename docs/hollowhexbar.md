# Hollow hexagonal bar

```text
hollowhexbar_outeraf25mm_inneraf21mm_l100mm_regular_cornerr0mm
```

Hollow stock with a regular hexagonal outside and a sharp regular hexagonal
opening. The hexagons share a center and orientation in XY. Two outer flats
are normal to X and opposite vertices lie on Y. The ends are at Z=0 and
Z=length.

| Property | Tokens | Meaning |
| --- | --- | --- |
| `outerAcrossFlats` | `outeraf`, `outeracrossflats` | Distance between opposite outside flats |
| `innerAcrossFlats` | `inneraf`, `inneracrossflats` | Distance between opposite inside flats |
| `length` | `l`, `length` | Axial length |
| `regular` | `regular` | Value-free profile flag, defaults to true |
| `cornerRadius` | `cornerr`, `cornerradius` | Fillet radius at the six outside corners, defaults to zero |

The fillets must leave six positive-width flats. The sharp corners of the
opening must fit inside the rounded outline with positive clearance. The
example has a 2 mm wall across the flats.

Lengths normalize to millimeters. Bare numbers mean millimeters. Complete
decimal lengths accept mm, cm, m, in, inch, mil, ft and feet. Token order and
case are unrestricted. Unknown and repeated tokens and valued flags fail.

`getHollowHexBarDimensions` returns the normalized props, apothems, flat wall,
corner distances and clearance, outer flat length, size, bounds and end
datums. Roadmap item
[1000](https://github.com/tscircuit/modelprinter/issues/13#issuecomment-5977317182).
