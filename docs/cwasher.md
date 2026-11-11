# C-shaped washer

`cwasher` defines a flat washer with a round bore and a straight-sided radial
opening.

```ts
mp.string("cwasher_id8.4mm_od22mm_h2mm_gap10mm").json()
```

The full roadmap string also accepts `spec(custom)`, `cut(parallel)`, and
`opening(radial)`. Their flag forms are `custom`, `parallelcut`, and
`radialopening`. These selectors default to true.

The bore diameter must be smaller than the outside diameter. The opening is
centered along a radius and its width must be positive and smaller than the
outside diameter. A width of 10 mm is valid for an 8.4 mm bore and a 22 mm
outside diameter.

`getCWasherDimensions` reports the radii, half opening width, annular radial
width, and the side margin from each parallel cut line to the outer tangent.
