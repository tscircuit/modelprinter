# `pushbutton`

Industrial 22 mm panel-mount round momentary pushbutton with a raised bezel head, retaining-nut threaded barrel, and rear contact block (roadmap item `0143`).

## Canonical Model String

```text
pushbutton_cutout22.5mm_bodyod22mm_l40mm_headod28mm_headh5mm_roundmomentary_threadnut_rearblock
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `cutout<len>` | `cutoutDiameter` | `22.5` | Panel mounting hole cutout diameter (mm) |
| `bodyod<len>` | `bodyOuterDiameter` | `22` | Threaded mounting barrel outside diameter (mm) |
| `l<len>` | `rearLength` | `40` | Rear barrel and contact-block depth behind panel (mm) |
| `headod<len>` | `headOuterDiameter` | `28` | Front bezel/actuator head outside diameter (mm) |
| `headh<len>` | `headHeight` | `5` | Raised head height forward of panel face (mm) |
| `roundmomentary` | `roundMomentary` | `true` | Round momentary actuator flag |
| `threadnut` | `threadNut` | `true` | Threaded barrel and retaining nut mounting flag |
| `rearblock` | `rearBlock` | `true` | Rectangular rear contact block flag |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on the barrel axis at the front panel bearing plane (`panelSeatZ = 0`), with the actuator head reaching `frontZ = headHeight` and the rear contact block reaching `rearZ = -rearLength`.
- **Validation**: Ensures `bodyOuterDiameter <= cutoutDiameter < headOuterDiameter` while rejecting legacy `type(...)`, `mount(...)`, and `contacts(...)` selectors.
