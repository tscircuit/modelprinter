# T-slot join plate

```text
tslotjoinplate_l80mm_w20mm_t4mm_slots4_slot(5mm,10mm)_p20mm
```

This custom flat straight splice plate joins collinear T-slot frame members with
longitudinal capsule through-slots spaced at a constant pitch along the plate
centerline. No supplier series is implied.

| Token | JSON property | Default |
| --- | --- | --- |
| `l`, `length` | `length` | 80 mm |
| `w`, `width` | `width` | 20 mm |
| `t`, `thickness` | `thickness` | 4 mm |
| `slots`, `slotcount` | `slotCount` | 4 |
| `slot(width,length)` | `slot` | [5 mm, 10 mm] |
| `p`, `pitch` | `pitch` | 20 mm |

The local mounting datum is the center of the lower mounting face at
`(X,Y,Z)=(0,0,0)`. The rectangular plate spans `±length/2` along `X`,
`±width/2` along `Y`, and from `Z=0` to `+thickness` along `Z`. All outer edges
and corners are square with zero fillets or chamfers.

Each slot is a capsule of transverse width `slot[0]` and overall longitudinal
length `slot[1]` (including both semicircular ends of radius `slot[0]/2`),
oriented along `+X` (`0` degrees) and centered on `Y=0`. The array of
`slotCount` slots (`2..64`) is centered symmetrically about `X=0`, so slot `i`
(`0..slotCount-1`) has center `(-(slotCount-1)*pitch/2 + i*pitch, 0, 0)` and
cuts through `+Z` by `thickness`. `getTSlotJoinPlateMountingSlots` and
`getTSlotJoinPlateDimensions` return these resolved mounting coordinates,
margins, ligaments, and envelope bounds.

Validation requires `slot[1] >= slot[0]`, `slot[0] < width`, `pitch > slot[1]`,
and `(slotCount - 1) * pitch + slot[1] < length` so every slot retains positive
side margins, end margins, and inter-slot ligaments. Lengths normalize to mm
from finite numbers or complete unit strings (`mm`, `cm`, `m`, `in`, `inch`,
`mil`, `ft`, `feet`). Geometry generation belongs in `jscad-electronics`.
