# Blade Fuse (`bladefuse`)

Flat plug-in fuse envelope with a rectangular insulating housing and two parallel contact blades.

## Example Model String

```text
bladefuse_regularflatblade_w19.1mm_bodyh12mm_t5.1mm_blades2_bladel7mm_bladew5.2mm_bladet0.65mm_p8mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `regularflatblade` | `regularFlatBlade` | `true` | Value-free regular flat-blade form flag |
| `w<length>` | `width` | `19.1 mm` | Insulating housing width |
| `bodyh<length>` | `bodyHeight` | `12 mm` | Insulating housing height |
| `t<length>` | `thickness` | `5.1 mm` | Insulating housing thickness |
| `blades2` | `blades` | `2` | Parallel contact blade count |
| `bladel<length>` | `bladeLength` | `7 mm` | Exposed blade projection below body |
| `bladew<length>` | `bladeWidth` | `5.2 mm` | Individual blade width |
| `bladet<length>` | `bladeThickness` | `0.65 mm` | Individual blade thickness |
| `p<length>` | `pitch` | `8 mm` | Center-to-center blade pitch |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Center of the lower housing seating face where blades emerge (`bottomZ = -bladeLength`, `topZ = bodyHeight`).
