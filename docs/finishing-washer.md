# Finishing Washer (`finishingwasher`)

Raised cup countersunk finishing washer with a conical screw seat and flat outer rim (roadmap #13, item 0323).

## Example Model String

```text
finishingwasher_custom_id4.5mm_od12mm_h3mm_strip0.8mm_cup_seatangle90deg_rimw1mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `id<length>` | `innerDiameter` | `4.5 mm` | Screw clearance hole diameter |
| `od<length>` | `outerDiameter` | `12 mm` | Overall cup outside diameter |
| `h<length>`, `height<length>` | `height` | `3 mm` | Overall raised cup height |
| `strip<length>` | `stripThickness` | `0.8 mm` | Formed sheet stock thickness |
| `cup` | `cup` | `true` | Value-free raised cup form flag |
| `seatangle<deg>` | `seatAngleDeg` | `90 deg` | Included countersunk screw seat angle |
| `rimw<length>` | `rimWidth` | `1 mm` | Flat outer rim radial width |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Bottom base plane (`bottomZ = 0`, `topZ = height`).
