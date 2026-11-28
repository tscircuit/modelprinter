# `camlatch`

Quarter-turn panel barrel cam latch with a slotted rotary head flange, metric threaded barrel, and flat rear locking cam bar (roadmap item `0095`).

## Canonical Model String

```text
camlatch_cutout18mm_m18_threadpitch1mm_barrell25mm_headod22mm_cam(30mm,10mm,3mm)_slotdrive_turn90deg
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `cutout<len>` | `cutoutDiameter` | `18` | Panel cutout hole diameter (mm) |
| `m<size>` | `thread` | `"m18"` | Metric threaded barrel designation |
| `threadpitch<len>` | `threadPitch` | `1` | Fine barrel thread pitch (mm) |
| `barrell<len>` | `barrelLength` | `25` | Threaded barrel grip length behind panel (mm) |
| `headod<len>` | `headOuterDiameter` | `22` | Front slotted bezel flange outside diameter (mm) |
| `cam(<l>,<w>,<t>)` | `camLength`, `camWidth`, `camThickness` | `30`, `10`, `3` | Flat rear cam arm dimensions (mm) |
| `slotdrive` / `slotted` | `slotDrive` | `true` | Coin/screwdriver slot actuator flag |
| `turn90deg` | `turnAngle` | `90` | Quarter-turn operating travel (deg) |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on the rotary barrel axis at the front panel bearing face (`panelSeatZ = 0`), with head flange at `frontZ = headHeight` and rear cam back face at `rearZ = -(barrelLength + camThickness)`.
- **Validation**: Ensures barrel thread matches `cutoutDiameter`, `headOuterDiameter > cutoutDiameter`, and cam projection beyond the barrel while rejecting legacy `drive(...)` selectors.
