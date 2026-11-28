# `fuseholder`

Panel-mounted cartridge fuse holder with a threaded mounting barrel, removable front bayonet cap, and rear solder terminals (roadmap item `0125`).

## Canonical Model String

```text
fuseholder_fuse(5mm,20mm)_panelhole12mm_m12_threadpitch1mm_bodyl35mm_capod16mm_panelbayonet
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `fuse(<d>,<l>)` / `fused<len>` + `fusel<len>` | `fuseDiameter`, `fuseLength` | `5`, `20` | Cartridge fuse diameter and length (mm) |
| `panelhole<len>` | `panelHoleDiameter` | `12` | Panel mounting cutout diameter (mm) |
| `m<size>` | `thread` | `"m12"` | Metric panel barrel thread designation |
| `threadpitch<len>` | `threadPitch` | `1` | Fine panel barrel thread pitch (mm) |
| `bodyl<len>` | `bodyLength` | `35` | Rear barrel projection behind panel face (mm) |
| `capod<len>` | `capOuterDiameter` | `16` | Front bayonet cap flange outside diameter (mm) |
| `panelbayonet` | `panelBayonet` | `true` | Removable front bayonet cap panel holder flag |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on the barrel axis at the front panel bearing face (`panelSeatZ = 0`), with the bayonet cap extending to `frontZ = capHeight` and the rear barrel/solder tabs extending to `rearZ = -bodyLength`.
- **Validation**: Verifies cartridge clearance inside the threaded barrel, cap flange overhang beyond the panel cutout, and body length containment while rejecting legacy `type(...)` selectors.
