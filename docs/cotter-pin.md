# Cotter pin parameter contract

```text
cotterpin_iso1234_nominal2mm_l25mm_straight
```

`cotterpin` defines an unbent (`straight`) ISO 1234 split cotter pin with a
looped head above the bearing datum `Z=0` and two unequal straight legs
extending to `Z=-length` and `Z=-(length + legDiff)`. Value-free `iso1234` and
`straight` flags replace legacy `standard(...)` and `state(...)` selectors.

| Nominal size | Shank OD (`d1`) | Eye OD (`c`) | Eye height | Leg tip offset (`a`) |
| --- | --- | --- | --- | --- |
| 1.6 | 1.4 | 2.8 | 3.2 | 1.6 |
| 2 | 1.8 | 3.6 | 4 | 2 |
| 2.5 | 2.3 | 4.6 | 5 | 2.5 |
| 3.2 | 2.9 | 5.8 | 6.4 | 3.2 |
| 4 | 3.7 | 7.4 | 8 | 4 |
| 5 | 4.6 | 9.2 | 10 | 4 |
| 6.3 | 5.9 | 11.8 | 12.6 | 4 |
| 8 | 7.5 | 15 | 16 | 4 |

`getCotterPinDimensions` resolves eye dimensions, short/long leg lengths, and
tip elevations in millimeters. Geometry generation belongs in
`jscad-electronics`.
