# Circular-Arc Leaf Spring (`leafspring`)

Single constant-thickness flat strip leaf spring formed along a circular centerline arc with square ends.

## Example Model String

```text
leafspring_custom_w15mm_arcl80mm_h1mm_radius100mm_circulararc_squareends_free
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `w<length>` | `width` | `15 mm` | Strip width |
| `arcl<length>` | `arcLength` | `80 mm` | Centerline arc length |
| `h<length>` | `thickness` | `1 mm` | Strip thickness |
| `radius<length>` | `radius` | `100 mm` | Centerline arc radius |
| `circulararc` | `circularArc` | `true` | Value-free circular arc form flag |
| `squareends` | `squareEnds` | `true` | Value-free square ends flag |
| `free` | `freeState` | `true` | Value-free unloaded free pose flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Midpoint of the chord line joining the lower end tips (`bottomZ = 0`, `topZ = camberHeight + thickness`).
