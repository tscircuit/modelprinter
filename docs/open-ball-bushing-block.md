# Open Ball-Bushing Block (`openballbushingblock`)

Open linear ball-bushing pillow block (SBR16UU style) with four top tapped mounting holes and a bottom shaft-support slot.

## Example Model String

```text
openballbushingblock_bore16mm_l50mm_w44mm_h33mm_openrecirculating_top4hole_holegrid(30mm,36mm)_m5
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `bore<length>` | `boreDiameter` | `16 mm` | Supported-rail shaft diameter |
| `l<length>` | `length` | `50 mm` | Axial block length |
| `w<length>` | `width` | `44 mm` | Transverse block width |
| `h<length>` | `height` | `33 mm` | Block height |
| `openrecirculating` | `openRecirculating` | `true` | Value-free open bushing flag |
| `top4hole` | `top4Hole` | `true` | Value-free four-hole top mount flag |
| `holegrid(x,y)` | `holeGridX`, `holeGridY` | `30 mm`, `36 mm` | Tapped top hole grid |
| `m<size>` | `thread` | `"m5"` | Tapped top hole metric thread |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Centered on the lower slot plane (`bottomZ = 0`, `topZ = height`).
