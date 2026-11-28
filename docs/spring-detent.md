# Threaded Ball Spring Detent (`springdetent`)

Headless threaded spring-ball detent barrel with a captive nose ball and rear screwdriver slot.

## Example Model String

```text
springdetent_custom_m6_l15mm_balld3mm_projection1mm_flatfront_slottedrear_slotw1mm_slotdepth1mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `m<size>` | `thread` | `"m6"` | External barrel metric thread |
| `l<length>` | `length` | `15 mm` | Threaded barrel length |
| `balld<length>` | `ballDiameter` | `3 mm` | Captive detent ball diameter |
| `projection<length>` | `projection` | `1 mm` | Axial ball projection beyond nose |
| `flatfront` | `flatFront` | `true` | Value-free flat front nose flag |
| `slottedrear` | `slottedRear` | `true` | Value-free rear screwdriver slot flag |
| `slotw<length>` | `slotWidth` | `1 mm` | Rear slot width |
| `slotdepth<length>` | `slotDepth` | `1 mm` | Rear slot depth |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Flat front barrel nose face (`bottomZ = -length`, `topZ = projection`).
