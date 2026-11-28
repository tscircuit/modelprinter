# Threaded Pin Spring Plunger (`springplunger`)

Threaded headless spring plunger with a rounded nose pin and rear screwdriver installation slot.

## Example Model String

```text
springplunger_custom_m6_l20mm_pind3mm_projection4mm_stroke4mm_roundtip_slottedrear_slotw1mm_slotdepth1mm_extended
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `m<size>` | `thread` | `"m6"` | External metric thread |
| `l<length>` | `length` | `20 mm` | Threaded barrel length |
| `pind<length>` | `pinDiameter` | `3 mm` | Rounded nose pin diameter |
| `projection<length>` | `projection` | `4 mm` | Extended nose pin projection |
| `stroke<length>` | `stroke` | `4 mm` | Maximum axial plunger travel |
| `roundtip` | `roundTip` | `true` | Value-free rounded pin tip flag |
| `slottedrear` | `slottedRear` | `true` | Value-free slotted rear face flag |
| `slotw<length>` | `slotWidth` | `1 mm` | Rear slot width |
| `slotdepth<length>` | `slotDepth` | `1 mm` | Rear slot depth |
| `extended` | `extended` | `true` | Value-free extended pose flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Front barrel shoulder plane (`bottomZ = -length`, `topZ = projection`).
