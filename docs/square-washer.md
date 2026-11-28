# Square Washer (`squarewasher`)

Flat square plate bearing washer with a centered clearance bore and square outside corners (roadmap #13, item 0318).

## Example Model String

```text
squarewasher_custom_id8.4mm_w25mm_l25mm_h3mm_centeredhole_squarecorners
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `id<length>` | `innerDiameter` | `8.4 mm` | Centered round bolt hole diameter |
| `w<length>`, `width<length>` | `width` | `25 mm` | Plate width along X |
| `l<length>`, `length<length>` | `length` | `25 mm` | Plate length along Y |
| `h<length>`, `t<length>` | `height` | `3 mm` | Plate thickness along +Z |
| `centeredhole` | `centeredHole` | `true` | Value-free centered hole flag |
| `squarecorners` | `squareCorners` | `true` | Value-free square corners flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Lower bearing face center (`bottomZ = 0`, `topZ = height`).
