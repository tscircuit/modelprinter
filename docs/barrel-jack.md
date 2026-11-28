# `barreljack`

Horizontal through-hole PCB DC barrel power jack with a rectangular box housing and three downward solder contacts (roadmap item `0132`).

## Canonical Model String

```text
barreljack_boxjack_plugod5.5mm_pinod2.1mm_w9mm_h11mm_l14.5mm_throughhole_horizontal_contacts3_frontcenterrear
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `boxjack` | `boxJack` | `true` | Rectangular enclosed box-jack form flag |
| `plugod<len>` | `plugOuterDiameter` | `5.5` | Mating DC barrel plug outside diameter (mm) |
| `pinod<len>` | `centerPinDiameter` | `2.1` | Center contact pin outside diameter (mm) |
| `w<len>` | `width` | `9` | Housing width along `X` (mm) |
| `h<len>` | `height` | `11` | Housing height above PCB seating plane `Z = 0` (mm) |
| `l<len>` | `length` | `14.5` | Housing length along mating axis `Y` (mm) |
| `throughhole` / `tht` | `throughHole` | `true` | Downward through-hole solder tab flag |
| `horizontal` | `horizontal` | `true` | Horizontal plug insertion axis parallel to PCB |
| `contacts3` | `contacts` | `3` | Three-terminal switched barrel jack |
| `frontcenterrear` | `frontCenterRear` | `true` | Sleeve/shunt/tip contact layout flag |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered on the housing footprint `(X, Y)` on the PCB mounting face (`bottomZ = 0`), with the mating plug entry at `frontY = -length / 2` and housing top at `topZ = height`.
- **Validation**: Ensures annular clearance between `plugOuterDiameter` and `centerPinDiameter`, housing containment of the mating bore, and rejection of legacy parenthesized selectors (`form(...)`, `mount(...)`, `axis(...)`, `pinout(...)`).
