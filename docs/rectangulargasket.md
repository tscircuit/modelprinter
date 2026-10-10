# RectangularGasket

```text
rectangulargasket_w80mm_h50mm_border5mm_t2mm_cornerr5mm_flatframe
```

Closed rounded rectangular flat seal centered on XY, with mating face Z=0 and top Z=thickness. Width and height are outside XY extents; border is the straight-side setback of the inner opening. The inner corner radius is max(0, outer corner radius minus border), giving concentric rounded corners when the border is thinner than the radius and square inner corners otherwise.

Lengths accept complete decimals with optional units and normalize to millimeters. The schema rejects unknown fields, duplicate aliases, malformed tokens and dimensions that eliminate required material. `getRectangularGasketDimensions` exposes the resolved dimensions and installation datums. Legacy roadmap selectors map to value-free flags; there are no enum selectors in the resolved contract.
