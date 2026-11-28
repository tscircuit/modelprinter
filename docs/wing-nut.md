# Wing nut parameter contract

```text
wingnut_din315_m6_roundedwings
```

`wingnut_m6` defaults to DIN 315 German-form rounded-wing nuts with a tapered
circular central boss, two solid opposing rounded wings along `X`, and a
right-hand ISO metric coarse (`6H`) through-thread along `+Z`. Value-free
`din315` and `roundedwings` flags restate the selection; legacy `standard(...)`
and `wings(...)` selectors are rejected.

| Size | Coarse pitch | Base OD (`d2`) | Top boss OD (`d3`) | Boss height (`m`) | Wing span (`e`) | Total height (`h`) | Wing thickness (`g`) |
| --- | --- | --- | --- | --- | --- | --- | --- |
| M4 | 0.7 | 9 | 8 | 5 | 20 | 10 | 2.2 |
| M5 | 0.8 | 11 | 10 | 6 | 26 | 13 | 2.8 |
| M6 | 1 | 13 | 12 | 8 | 32 | 16 | 3.3 |
| M8 | 1.25 | 16 | 14 | 10 | 40 | 20 | 4 |
| M10 | 1.5 | 20 | 18 | 12 | 50 | 25 | 5 |
| M12 | 1.75 | 23 | 20 | 14 | 64 | 32 | 6 |

The lower bearing face lies at `Z=0`, the central boss top lies at `Z=bossHeight`,
and the rounded wing crests reach `Z=height`. `getWingNutDimensions` resolves
these untoleranced dimensions in mm. Geometry generation belongs in
`jscad-electronics`.
