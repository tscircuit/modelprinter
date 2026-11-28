# Cartridge Fuse Block (`fuseblock`)

Insulating cartridge fuse cradle with two opposed spring end clips and two base fixing holes.

## Example Model String

```text
fuseblock_fuse(10mm,38mm)_w25mm_l60mm_h18mm_clipod10mm_holes2_hole4mm_hp48mm
```

## Parameters and Flags

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `fuse(<d>,<l>)` | `fuseDiameter`, `fuseLength` | `10 mm`, `38 mm` | Cartridge fuse diameter and length |
| `w<length>` | `width` | `25 mm` | Insulating cradle width |
| `l<length>` | `length` | `60 mm` | Insulating cradle length |
| `h<length>` | `height` | `18 mm` | Cradle height |
| `clipod<length>` | `clipOuterDiameter` | `10 mm` | Spring end clip outer diameter |
| `holes2` | `holes` | `2` | Base fixing hole count |
| `hole<length>` | `holeDiameter` | `4 mm` | Base fixing hole diameter |
| `hp<length>` | `holePitch` | `48 mm` | Base fixing hole pitch |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Center of the bottom mounting plane (`bottomZ = 0`, `topZ = height`).
