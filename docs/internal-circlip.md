# Internal Circlip (`internalcirclip`)

DIN 472 normal-series internal retaining ring shown in its uncompressed free state with two inward plier-hole lugs.

## Example Model String

```text
internalcirclip_din472_bored25mm_free
```

## Parameters and Flags

| Token | Property | Normalized Unit | Notes |
| --- | --- | --- | --- |
| `din472` | `din472` | `true` | Value-free DIN 472 normal-series flag (defaults to `true`) |
| `bored<length>` | `boreDiameter` | `mm` | Nominal housing bore diameter from pinned DIN 472 table |
| `free` | `free` | `true` | Uncompressed free-state ring geometry (defaults to `true`) |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Center of ring on the lower flat face (`bottomZ = 0`, `topZ = thickness`).
