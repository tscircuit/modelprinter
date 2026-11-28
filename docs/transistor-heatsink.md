# Stamped U-Wing Transistor Heatsink (`transistorheatsink`)

Stamped TO-220 style sheet-metal heatsink with flat device mounting web, folded U-wings, and two PCB mounting tabs.

## Example Model String

```text
transistorheatsink_w25mm_h30mm_d15mm_t1mm_ushapedwings_devicehole3.2mm_holez10mm_tabs2_tabhole3mm_hp20mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `w<length>` | `width` | `25 mm` | Overall heatsink width |
| `h<length>` | `height` | `30 mm` | Standing heatsink height above board |
| `d<length>` | `depth` | `15 mm` | Folded wing depth |
| `t<length>` | `thickness` | `1 mm` | Stamped sheet thickness |
| `ushapedwings` | `uShapedWings` | `true` | Value-free U-shaped side wings flag |
| `devicehole<length>` | `deviceHoleDiameter` | `3.2 mm` | Device fixing hole diameter |
| `holez<length>` | `holeZ` | `10 mm` | Device hole center height above base |
| `tabs2` | `tabs` | `2` | Board mounting tab count |
| `tabhole<length>` | `tabHoleDiameter` | `3 mm` | Tab hole diameter |
| `hp<length>` | `holePitch` | `20 mm` | Tab hole center-to-center pitch |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Board seating plane at heatsink center (`bottomZ = 0`, `topZ = height`).
