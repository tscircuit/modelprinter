# Conical Compression Spring (`conicalspring`)

Tapered conical compression spring with closed end coils in its free state.

## Example Model String

```text
conicalspring_custom_od15mm_endod8mm_wire1mm_l25mm_turns8_active6_closedends_righthand_free
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `custom` | `custom` | `true` | Value-free custom contract flag |
| `od<length>` | `outerDiameter` | `15 mm` | Large base coil outer diameter |
| `endod<length>` | `endOuterDiameter` | `8 mm` | Small top coil outer diameter |
| `wire<length>` | `wireDiameter` | `1 mm` | Round wire diameter |
| `l<length>` | `length` | `25 mm` | Unloaded free length |
| `turns<count>` | `turns` | `8` | Total coil turns |
| `active<count>` | `activeTurns` | `6` | Active deflecting turns |
| `closedends` | `closedEnds` | `true` | Value-free closed end turns flag |
| `righthand` / `lefthand` | `handedness` | `"right"` | Coil helix direction |
| `free` | `freeState` | `true` | Value-free unloaded pose flag |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Center of the large base seating plane (`bottomZ = 0`, `topZ = length`).
