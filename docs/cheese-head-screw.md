# Cheese-Head Screw (`cheeseheadscrew`)

ISO 1207 slotted cylindrical cheese-head metric machine screw.

## Example Model String

```text
cheeseheadscrew_iso1207_m3_l10mm_slotted
```

## Parameters and Flags

| Token | Property | Normalized Unit | Notes |
| --- | --- | --- | --- |
| `iso1207` | `iso1207` | `true` | Value-free ISO 1207 standard flag |
| `m<size>` | `thread` | `string` | Nominal metric thread (`m2`..`m10`) |
| `l<length>` | `length` | `mm` | Under-head shank length |
| `slotted` | `slotted` | `true` | Value-free slotted head drive flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Under-head bearing plane (`topZ = headHeight`, `bottomZ = -length`).
