# `usbconnector`

Right-angle through-hole USB 2.0 Type-B PCB receptacle (`TE 292304-1` drawing envelope) with four signal contacts and EMI shield mounting tabs (roadmap item `0137`).

## Canonical Model String

```text
usbconnector_te292304-1_usb2typeb_w12.04mm_h11.5mm_l15.71mm_throughhole_horizontal_contacts4_shield_mountp12.04mm_mountdia2.3mm_tail3.01mm
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `te292304-1` | `te292304_1` | `true` | TE 292304-1 part drawing profile flag |
| `usb2typeb` | `usb2TypeB` | `true` | USB 2.0 Type-B receptacle interface flag |
| `w<len>` | `width` | `12.04` | Shroud width along `X` (mm) |
| `h<len>` | `height` | `11.5` | Shroud height above PCB seating plane `Z = 0` (mm) |
| `l<len>` | `length` | `15.71` | Receptacle depth along mating axis `Y` (mm) |
| `throughhole` / `tht` | `throughHole` | `true` | Through-hole PCB solder tails flag |
| `horizontal` | `horizontal` | `true` | Right-angle horizontal plug entry flag |
| `contacts4` | `contacts` | `4` | Four-pin USB 2.0 contact array |
| `shield` / `unshielded` | `shield` | `true` | Outer metal EMI shell flag |
| `mountp<len>` | `mountPitch` | `12.04` | Shield tab mounting hole center pitch along `X` (mm) |
| `mountdia<len>` | `mountHoleDiameter` | `2.3` | Shield tab mounting drill diameter (mm) |
| `tail<len>` | `tailLength` | `3.01` | Downward solder-tail length below `Z = 0` (mm) |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on the receptacle footprint `(X, Y)` on the PCB mounting plane (`seatZ = 0`), with the mating opening at `frontY = -length / 2`, shroud top at `topZ = height`, and solder tails extending to `bottomZ = -tailLength`.
- **Validation**: Enforces Type-B cavity envelope minimums and mounting tab spacing while rejecting legacy `part(...)`, `interface(...)`, `mount(...)`, and `entry(...)` selectors.
