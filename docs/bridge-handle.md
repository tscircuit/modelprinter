# Bridge handle parameter contract

```text
bridgehandle_pitch100mm_w20mm_h30mm_gript8mm_footsize(20mm,20mm)_holes2_m5
```

`bridgehandle` defines a rectangular U-shaped bridge pull handle with two
coplanar mounting feet at `Z=0` and two blind right-hand ISO metric coarse (`6H`)
rear tapped fixing holes centered in the feet at `(±pitch / 2, 0)`.

## Local frame and defaults

- Foot bearing faces lie on `Z=0`, and the upper grip bar reaches `Z=height`
  (`30 mm`) with `gripThickness = 8 mm` (`22 mm` hand clearance underneath).
- Two mounting feet (`footSize = [20, 20]` mm along `[X, Y]`) are centered at
  `X = ±pitch / 2` (`100 mm`), giving an overall length of `pitch + footSize[0]`
  (`120 mm`) and clear inner span `pitch - footSize[0]` (`80 mm`).
- Supported rear tapped sizes are `M3`, `M4`, `M5` (default), `M6`, `M8`, `M10`,
  and `M12` with `2 * d` nominal blind thread depth.

`getBridgeHandleDimensions` resolves overall bounds, hand opening dimensions,
and rear tapped hole centers in millimeters. Geometry generation belongs in
`jscad-electronics`.
