# Square Nut (`squarenut`)

Four-sided metric square nut with a centered through-tapped bore and chamfered upper and lower edges.

## Example Model String

```text
squarenut_custom_m6_w10mm_h5mm_squarebody_throughbore_chamfer0.5mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `m<size>` | `thread` | `"m6"` | Nominal metric thread |
| `w<length>` | `width` | `10 mm` | Square across-flats width |
| `h<length>` | `height` | `5 mm` | Nut thickness |
| `squarebody` | `squareBody` | `true` | Value-free square body flag |
| `throughbore` | `throughBore` | `true` | Value-free through-tapped bore flag |
| `chamfer<length>` | `chamfer` | `0.5 mm` | Top and bottom edge chamfer |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Bore axis on lower bearing face (`bottomZ = 0`, `topZ = height`).
