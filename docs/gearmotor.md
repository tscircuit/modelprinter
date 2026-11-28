# `gearmotor`

Cylindrical DC motor and spur-gear reducer assembly with an eccentric offset output shaft and four front face mounting holes (roadmap item `0144`).

## Canonical Model String

```text
gearmotor_bodyod37mm_bodyl70mm_shaftd6mm_shaftl18mm_offset8mm_face4hole_pcd28mm_m3_offsetspur
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `bodyod<len>` | `bodyOuterDiameter` | `37` | Cylindrical motor/gearbox outside diameter (mm) |
| `bodyl<len>` | `bodyLength` | `70` | Combined motor can and gearbox length (mm) |
| `shaftd<len>` | `shaftDiameter` | `6` | Output shaft diameter (mm) |
| `shaftl<len>` | `shaftLength` | `18` | Output shaft projection beyond front face (mm) |
| `offset<len>` | `shaftOffset` | `8` | Radial offset from gearbox center to output shaft axis (mm) |
| `face4hole` | `face4Hole` | `true` | Four-hole front face mounting flag |
| `pcd<len>` | `pitchCircleDiameter` | `28` | Front mounting bolt circle diameter (mm) |
| `m<size>` | `thread` | `"m3"` | Front mounting hole metric thread |
| `offsetspur` | `offsetSpur` | `true` | Offset spur-gear reducer style flag |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on the cylindrical gearbox axis at the front mounting face (`mountFaceZ = 0`), with the offset output shaft tip at `shaftTipZ = shaftLength` and rear motor endcap at `rearZ = -bodyLength`.
- **Validation**: Ensures the offset shaft and bolt circle fit inside `bodyOuterDiameter` while rejecting legacy `mount(...)` and `style(...)` selectors.
