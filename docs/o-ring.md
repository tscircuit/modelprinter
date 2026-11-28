# O-Ring (`oring`)

AS568 toroidal sealing ring with a circular cross-section and pinned dash-size geometry.

## Example Model String

```text
oring_as568_size214_round_id0.984in_csd0.139in
```

## Parameters and Flags

| Token | Property | Normalized Unit | Notes |
| --- | --- | --- | --- |
| `as568` | `as568` | `true` | Value-free AS568 series flag (defaults to `true`) |
| `size<code>` | `size` | `string` | 3-digit AS568 dash number (e.g. `214`) |
| `round` | `round` | `true` | Toroidal circular cross-section flag (defaults to `true`) |
| `id<length>` | `innerDiameter` | `mm` | Optional inside diameter verified against AS568 table |
| `csd<length>` | `crossSectionDiameter` | `mm` | Optional cross-section diameter verified against AS568 table |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Torus center in the sealing mid-plane.
- **`Z` bounds**: `[-crossSectionDiameter / 2, +crossSectionDiameter / 2]`.
