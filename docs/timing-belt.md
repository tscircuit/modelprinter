# Timing Belt (`timingbelt`)

Endless synchronous HTD 5M curvilinear timing belt modeled in a circular free-loop pose.

## Example Model String

```text
timingbelt_pitch5mm_teeth100_w15mm_h3.6mm_htd5m_length500mm_endless
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `pitch<length>` | `pitch` | `5 mm` | Tooth pitch (5 mm for HTD 5M) |
| `teeth<int>` | `teeth` | `100` | Total tooth count around loop |
| `w<length>` | `width` | `15 mm` | Belt face width |
| `h<length>` | `beltHeight` | `3.6 mm` | Overall belt radial height |
| `htd5m` | `htd5m` | `true` | Value-free HTD 5M tooth profile flag |
| `length<length>` | `pitchLength` | `500 mm` | Loop pitch length (`teeth * pitch`) |
| `endless` | `endless` | `true` | Value-free closed endless belt flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Center of circular endless belt loop on lower edge (`bottomZ = 0`, `topZ = width`).
