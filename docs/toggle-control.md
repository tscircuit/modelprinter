# `togglecontrol`

Miniature panel-mount toggle switch with a rectangular rear body, threaded cylindrical bushing, pivoted vertical bat lever, and lower solder lugs (roadmap item `0140`).

## Canonical Model String

```text
togglecontrol_body(12mm,8mm,10mm)_m6_threadpitch0.75mm_bushingl6mm_leverl15mm_contacts3_solderlug_verticallever
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `body(<l>,<w>,<h>)` | `bodyLength`, `bodyWidth`, `bodyHeight` | `12`, `8`, `10` | Rectangular switch housing dimensions (mm) |
| `m<size>` | `thread` | `"m6"` | Panel bushing metric thread designation |
| `threadpitch<len>` | `threadPitch` | `0.75` | Fine bushing thread pitch (mm) |
| `bushingl<len>` | `bushingLength` | `6` | Threaded bushing height above switch shoulder (mm) |
| `leverl<len>` | `leverLength` | `15` | Toggle bat lever projection beyond bushing (mm) |
| `contacts2` / `contacts3` / `contacts6` | `contacts` | `3` | Lower solder-lug contact count |
| `solderlug` | `solderLug` | `true` | Pierced solder-lug terminal flag |
| `verticallever` | `verticalLever` | `true` | Neutral upright lever orientation flag |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on the bushing axis at the rear panel shoulder (`panelSeatZ = 0`), with bushing top at `bushingTopZ = bushingLength`, lever tip at `leverTipZ`, and rear solder lugs extending down to `lugTipZ`.
- **Validation**: Ensures the threaded bushing fits within `min(bodyLength, bodyWidth)` while rejecting legacy `tail(...)` and `leveraxis(...)` selectors.
