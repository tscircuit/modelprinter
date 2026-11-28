# `brakedcaster`

Plate-mounted total-lock braked swivel caster with a four-hole top mounting plate and foot brake pedal (roadmap item `0156`).

## Canonical Model String

```text
brakedcaster_wheeld75mm_wheelw25mm_platew60mm_plateh60mm_plate4hole_holegrid(45mm,45mm)_holed6mm_totalbrake
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `wheeld<len>` | `wheelDiameter` | `75` | Wheel outside diameter (mm) |
| `wheelw<len>` | `wheelWidth` | `25` | Wheel tread width (mm) |
| `platew<len>` | `plateWidth` | `60` | Top plate width along `X` (mm) |
| `plateh<len>` | `plateLength` | `60` | Top plate length along `Y` (mm) |
| `plate4hole` | `plate4Hole` | `true` | Four-hole top mounting plate flag |
| `holegrid(<x>,<y>)` | `holeGridX`, `holeGridY` | `45`, `45` | Top plate bolt hole grid pitches (mm) |
| `holed<len>` | `holeDiameter` | `6` | Mounting bolt hole diameter (mm) |
| `totalbrake` | `totalBrake` | `true` | Dual wheel-and-swivel total-lock brake pedal flag |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on the swivel kingpin axis on the top mounting face (`plateSeatZ = 0`), extending downward to `floorZ = -overallHeight`.
- **Validation**: Ensures wheel width and four-hole grid fit within the top mounting plate while rejecting legacy `mount(...)` and `brake(...)` selectors.
