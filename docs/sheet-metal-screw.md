# Sheet Metal Screw (`sheetmetalscrew`)

ISO 7049 type-C pointed pan-head tapping screw with a Phillips cross recess.

## Example Model String

```text
sheetmetalscrew_iso7049_st3.5_threadpitch1.3mm_righthanded_l13mm_typec_phillips
```

## Parameters and Flags

| Token | Property | Normalized Unit | Notes |
| --- | --- | --- | --- |
| `iso7049` | `iso7049` | `true` | Value-free ISO 7049 standard flag |
| `st<size>` | `tappingSize` | `string` | ISO tapping designation (`st2.9`..`st6.3`) |
| `threadpitch<length>` | `threadPitch` | `mm` | Optional pitch verified against ISO 7049 table |
| `righthanded` / `lefthanded` | `rightHanded` | `boolean` | Thread hand flags (defaults to `true`) |
| `l<length>` | `length` | `mm` | Under-head length |
| `typec` | `typeC` | `true` | Value-free pointed cone-end flag |
| `phillips` | `phillips` | `true` | Value-free cross-recess drive flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Under-head bearing plane on screw axis (`topZ = headHeight`, `bottomZ = -length`).
