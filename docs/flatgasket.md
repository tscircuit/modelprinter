# FlatGasket

```text
flatgasket_id20mm_od35mm_t2mm_flatannulus
```

Flat annular seal centered on XY. The mating face is Z=0 and the opposite face is Z=thickness. Both bore and outside walls are straight, with no bevels. Custom dimensions specify nominal geometry without material or compression properties.

Lengths accept complete decimals with optional units and normalize to millimeters. The schema rejects unknown fields, duplicate aliases, malformed tokens and dimensions that eliminate required material. `getFlatGasketDimensions` exposes the resolved dimensions and installation datums. Legacy roadmap selectors map to value-free flags; there are no enum selectors in the resolved contract.
