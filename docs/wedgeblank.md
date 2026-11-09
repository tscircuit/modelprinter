# Wedge blank

```text
wedgeblank_l80mm_w40mm_h20mm_tip2mm_lengthwise_edger0mm
```

Solid stock with a flat base at Y=0, centered width on X, and a top face
that tapers linearly from the thick end at Z=0 to the thin end at Z=length.
The end faces are planar.

| Property | Tokens | Meaning |
| --- | --- | --- |
| `length` | `l`, `length` | End-to-end distance along Z |
| `width` | `w`, `width` | Full width along X |
| `height` | `h`, `height` | Height at the thick end |
| `tipHeight` | `tip`, `tipheight` | Height at the thin end, positive and smaller than height |
| `lengthwise` | `lengthwise` | Value-free taper flag, defaults to true |
| `edgeRadius` | `edger`, `edgeradius` | Equal fillets at the four longitudinal edges, defaults to zero |

The fillets join each side to the top and base. At taper angle θ, a radius r
uses r / cos(θ) of the side at the upper edge and r at the base. The radius
must be smaller than half the width and leave positive side height at the
thin end. The nominal axial bounds remain unchanged. The example rises
18 mm over 80 mm from the thin end to the thick end.
Radii within numerical rounding distance of contact are rejected.

Lengths normalize to millimeters. Bare numbers mean millimeters. Complete
decimal lengths accept mm, cm, m, in, inch, mil, ft and feet. Token order and
case are unrestricted. Unknown and repeated tokens and valued flags fail.

`getWedgeBlankDimensions` returns the normalized props, rise, taper angle in
degrees, size, bounds and end datums. Roadmap item
[0947](https://github.com/tscircuit/modelprinter/issues/13#issuecomment-5977317182).
