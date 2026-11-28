# Spring pin parameter contract

```text
springpin_iso8752_holed3mm_l10mm_free
```

`springpin` defines a heavy-duty slotted tubular spring pin per ISO 8752 in its
larger-diameter uncompressed (`free`) state along `+Z` from `Z=0` to `Z=length`.
Value-free `iso8752` and `free` flags replace legacy `standard(...)` and
`state(...)` selectors.

| Nominal hole (`d1`) | Free OD (`d2`) | Wall (`s`) | Slot width (`a`) | End chamfer (`c`) |
| --- | --- | --- | --- | --- |
| 1.5 | 1.75 | 0.3 | 0.35 | 0.3 |
| 2 | 2.35 | 0.4 | 0.4 | 0.35 |
| 2.5 | 2.85 | 0.5 | 0.5 | 0.4 |
| 3 | 3.4 | 0.6 | 0.6 | 0.5 |
| 4 | 4.45 | 0.8 | 0.8 | 0.65 |
| 5 | 5.45 | 1 | 0.9 | 0.9 |
| 6 | 6.5 | 1.2 | 1.1 | 1.2 |
| 8 | 8.65 | 1.5 | 1.5 | 1.6 |
| 10 | 10.65 | 2 | 1.8 | 2 |
| 12 | 12.65 | 2.5 | 2 | 2 |

`getSpringPinDimensions` resolves uncompressed outer/inner diameters, longitudinal
slot width, and end chamfers in mm. Geometry generation belongs in
`jscad-electronics`.
