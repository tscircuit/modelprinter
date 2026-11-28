# `eclip`

DIN 6799 radial E-shaped retaining ring for shaft grooves in its uncompressed free state (roadmap item `0041`).

## Canonical Model String

```text
eclip_din6799_shaftd6mm_grooved5mm_free
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `din6799` | `din6799` | `true` | DIN 6799 radial E-clip dimensional table flag |
| `shaftd<len>` | `shaftDiameter` | required | Nominal shaft diameter matching the DIN 6799 groove range (mm) |
| `grooved<len>` | `grooveDiameter` | required | Tabulated DIN 6799 nominal groove diameter `1.2..24` (mm) |
| `free` | `free` | `true` | Uncompressed free-state geometry flag |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Groove center on the lower flat bearing face (`bottomZ = 0`), with the open radial insertion gap facing `-Y` and central prong along `+Y`.
- **Axis**: `+Z` spans the tabulated ring thickness `s` (`topZ = thickness`).
- **Validation**: Verifies tabulated DIN 6799 groove sizes and permitted shaft diameter intervals while rejecting legacy `standard(...)` and `state(...)` selectors.
