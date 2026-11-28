# Lead Screw (`leadscrew`)

Right-hand ISO metric 30-degree trapezoidal lead screw shaft.

## Example Model String

```text
leadscrew_d8mm_l300mm_tr8_threadpitch2mm_lead2mm_starts1
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `d<length>` | `diameter` | `8 mm` | Nominal major diameter |
| `l<length>` | `length` | `300 mm` | Overall screw length |
| `tr<size>` | `trapezoidalThread` | `"tr8"` | ISO trapezoidal thread designation |
| `threadpitch<length>` | `threadPitch` | `2 mm` | Axial crest-to-crest thread pitch |
| `lead<length>` | `lead` | `2 mm` | Axial advance per revolution (`starts * threadPitch`) |
| `starts<int>` | `starts` | `1` | Thread start count |
| `righthanded` | `rightHanded` | `true` | Value-free right-hand helix flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Screw axis on the lower end face (`bottomZ = 0`, `topZ = length`).
