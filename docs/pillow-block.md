# `pillowblock`

Mounted pedestal pillow-block bearing housing with a self-aligning spherical insert and two slotted mounting feet (roadmap item `0046`).

## Canonical Model String

```text
pillowblock_bore20mm_l127mm_w38mm_h65mm_base2slot_slotw10mm_slotl15mm_slotpitch95mm
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `bore<len>` | `boreDiameter` | `20` | Shaft bore diameter (mm) |
| `l<len>` | `length` | `127` | Overall pedestal foot span along `X` (mm) |
| `w<len>` | `width` | `38` | Housing base width along `Y` (mm) |
| `h<len>` | `height` | `65` | Overall pedestal height along `Z` (mm) |
| `base2slot` | `base2Slot` | `true` | Two-slot base foot mounting flag |
| `slotw<len>` | `slotWidth` | `10` | Bolt slot width (mm) |
| `slotl<len>` | `slotLength` | `15` | Bolt slot overall length along `X` (mm) |
| `slotpitch<len>` | `slotPitch` | `95` | Center-to-center spacing between base slots (mm) |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on the pedestal base `(X, Y)` at `bottomZ = 0`, with shaft axis along `Y` at `Z = shaftCenterHeight` and crown at `topZ = height`.
- **Validation**: Ensures slots fit inside the base foot and clear the central bearing bore while rejecting legacy `mount(...)` selectors.
