# Self-Clinching Stud (`clinchstud`)

Flush-head press-in sheet-metal clinch stud with radial anti-rotation serrations and an undercut clinching groove.

## Example Model String

```text
clinchstud_custom_m4_l15mm_fullthread_headod7mm_headh1.5mm_neckd3.4mm_neckl1mm_serrations12_serrationdepth0.3mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `m<size>` | `thread` | `"m4"` | Nominal metric thread |
| `l<length>` | `length` | `15 mm` | Projecting stud length |
| `fullthread` | `fullThread` | `true` | Value-free full-thread flag |
| `headod<length>` | `headOuterDiameter` | `7 mm` | Flush clinch head diameter |
| `headh<length>` | `headHeight` | `1.5 mm` | Serrated head thickness |
| `neckd<length>` | `neckDiameter` | `3.4 mm` | Clinch capture groove diameter |
| `neckl<length>` | `neckLength` | `1 mm` | Capture groove axial width |
| `serrations<int>` | `serrations` | `12` | Radial anti-rotation rib count |
| `serrationdepth<length>` | `serrationDepth` | `0.3 mm` | Serration rib height |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Under-head sheet-metal interface (`bottomZ = -headHeight`, `topZ = length`).
