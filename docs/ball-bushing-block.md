# Ball Bushing Block (`ballbushingblock`)

Rectangular pillow-block housing carrying a closed recirculating linear ball bushing with four tapped top mounting holes.

## Example Model String

```text
ballbushingblock_bore8mm_l30mm_w34mm_h22mm_closedrecirculating_top4hole_holegrid(18mm,24mm)_m4
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `bore<length>` | `boreDiameter` | `8 mm` | Nominal shaft bore diameter |
| `l<length>` | `length` | `30 mm` | Axial housing length (`X`) |
| `w<length>` | `width` | `34 mm` | Transverse housing width (`Y`) |
| `h<length>` | `height` | `22 mm` | Overall block height (`Z`) |
| `closedrecirculating` | `closedRecirculating` | `true` | Value-free closed recirculating bushing flag |
| `top4hole` | `top4Hole` | `true` | Value-free four-hole top mounting flag |
| `holegrid(x,y)` | `holeGridX`, `holeGridY` | `18 mm`, `24 mm` | Axial and transverse tapped-hole spacing |
| `m<size>` | `thread` | `"m4"` | ISO metric coarse tapped hole size |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Centered on the lower mounting face (`bottomZ = 0`, `topZ = height`, shaft axis at `Z = height / 2`).
