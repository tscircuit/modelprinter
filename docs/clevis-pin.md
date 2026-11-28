# Clevis pin parameter contract

```text
clevispin_iso2341_formb_d6mm_l30mm
```

`clevispin` defines an ISO 2341 Form B headed cylindrical clevis pin with a
transverse split-pin through-hole near its chamfered shank tip. Value-free
`iso2341` and `formb` flags replace legacy `standard(...)` and `form(...)`
selectors.

| Diameter (`d`) | Head OD (`dk`) | Head height (`k`) | Split-pin hole (`d2`) | Tip-to-hole center | End chamfer |
| --- | --- | --- | --- | --- | --- |
| 3 | 5 | 1 | 0.8 | 1.6 | 0.5 |
| 4 | 6 | 1 | 1 | 2.2 | 0.6 |
| 5 | 8 | 1.6 | 1.2 | 2.9 | 0.8 |
| 6 | 10 | 2 | 1.6 | 3.2 | 1 |
| 8 | 14 | 3 | 2 | 3.5 | 1.2 |
| 10 | 18 | 4 | 3.2 | 4.5 | 1.5 |
| 12 | 20 | 4 | 3.2 | 5.5 | 1.8 |
| 16 | 25 | 4.5 | 4 | 6 | 2 |

Under-head bearing face lies at `Z=0`, cylindrical head rises to `Z=headHeight`,
and shank extends to `Z=-length`. `getClevisPinDimensions` resolves effective
grip length (`l1`) and transverse hole elevation in millimeters. Geometry
generation belongs in `jscad-electronics`.
