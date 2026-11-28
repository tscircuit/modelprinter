# `swivelcaster`

Plate-mounted swivel caster with an offset trailing wheel fork and a four-hole rectangular top mounting plate (roadmap item `0150`).

## Canonical Model String

```text
swivelcaster_wheeld50mm_wheelw20mm_platew50mm_plateh50mm_plate4hole_holegrid(35mm,35mm)_holed6mm_swiveloffset20mm
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `wheeld<len>` | `wheelDiameter` | `50` | Tread wheel outside diameter (mm) |
| `wheelw<len>` | `wheelWidth` | `20` | Wheel tread width (mm) |
| `platew<len>` | `plateWidth` | `50` | Top mounting plate width along `X` (mm) |
| `plateh<len>` | `plateLength` | `50` | Top mounting plate length along `Y` (mm) |
| `plate4hole` | `plate4Hole` | `true` | Four-hole top mounting plate flag |
| `holegrid(<x>,<y>)` | `holeGridX`, `holeGridY` | `35`, `35` | Top plate bolt hole grid pitches (mm) |
| `holed<len>` | `holeDiameter` | `6` | Mounting bolt hole diameter (mm) |
| `swiveloffset<len>` | `swivelOffset` | `20` | Horizontal trail offset from swivel axis to axle (mm) |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on the swivel kingpin axis on the top mounting face (`plateSeatZ = 0`), extending downward to `floorZ = -overallHeight`.
- **Validation**: Ensures wheel width and bolt holes fit inside the top plate while rejecting legacy `mount(...)` selectors.
