# `thrustballbearing`

Single-direction axial thrust ball bearing with two flat-backed grooved washers and one rolling ball-cage row (roadmap item `0079`).

## Canonical Model String

```text
thrustballbearing_id10mm_od24mm_h9mm_series51100_flatwasherpair_rows1
```

Shorthand series strings such as `thrustballbearing51100` or `thrustballbearing_code51100` also populate the ISO 104 511-series envelope.

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `id<len>` | `innerDiameter` | from `code` | Shaft/housing bore diameter (mm) |
| `od<len>` | `outerDiameter` | from `code` | Outside washer diameter (mm) |
| `h<len>` | `height` | from `code` | Assembled axial bearing height `T` (mm) |
| `series<code>` / `code<code>` | `code` | optional | ISO 104 511-series designation (`51100..51108`) |
| `flatwasherpair` | `flatWasherPair` | `true` | Two flat-backed annular grooved washers |
| `rows1` | `rows` | `1` | Single axial ball row |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on the bore axis at the lower housing-washer seat (`bottomZ = 0`).
- **Axis**: `+Z` points axially through the ball cage to the upper shaft-washer face (`topZ = height`).
- **Validation**: Ensures `innerDiameter < outerDiameter`, verifies consistency against ISO 104 511-series tables when `code` is supplied, and rejects legacy `series(...)` / `style(...)` selectors.
