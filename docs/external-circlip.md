# External Circlip (`externalcirclip`)

DIN 471 normal-series external retaining ring shown in its uncompressed free state with two outward plier-hole lugs.

## Example Model String

```text
externalcirclip_din471_shaftd10mm_free
```

## Parameters and Flags

| Token | Property | Normalized Unit | Notes |
| --- | --- | --- | --- |
| `din471` | `din471` | `true` | Value-free DIN 471 normal-series flag (defaults to `true`) |
| `shaftd<length>` | `shaftDiameter` | `mm` | Nominal shaft diameter from pinned DIN 471 table |
| `free` | `free` | `true` | Uncompressed free-state ring geometry (defaults to `true`) |

Parenthesized selectors such as `standard(din471)` or `state(free)` are rejected in favor of value-free boolean flags.

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Center of the retaining ring bore on the lower flat face (`bottomZ = 0`).
- **`+Z`**: Ring axial thickness (`topZ = thickness`).
- **`+Y`**: Gap opening and outward plier lugs (`lugCount = 2`).
