# Weld Stud (`weldstud`)

Capacitor-discharge flanged metric weld stud with a centered weld-ignition tip beneath its mounting collar.

## Example Model String

```text
weldstud_custom_m6_l25mm_fullthread_baseod8mm_baseh1.5mm_weldtipd2mm_weldtipl1mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `m<size>` | `thread` | `"m6"` | Nominal metric thread |
| `l<length>` | `length` | `25 mm` | Threaded shank length above collar |
| `fullthread` | `fullThread` | `true` | Value-free full-thread flag |
| `baseod<length>` | `baseOuterDiameter` | `8 mm` | Weld flange collar OD |
| `baseh<length>` | `baseHeight` | `1.5 mm` | Weld flange collar height |
| `weldtipd<length>` | `weldTipDiameter` | `2 mm` | Ignition projection diameter |
| `weldtipl<length>` | `weldTipLength` | `1 mm` | Ignition projection length |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Sheet-metal weld interface plane (`bottomZ = -weldTipLength`, `topZ = baseHeight + length`).
