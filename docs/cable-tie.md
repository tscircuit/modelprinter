# Cable tie model strings

```
cabletie_l150mm_w3mm_t1mm_head(5mm,5mm,4mm)_toothp1mm_type(nonrelease)
```

This is a custom nominal flat tie with an integral rectangular ratchet head,
recessed sawtooth rack, and pointed insertion tail. It selects no vendor series
or strength standard. `type(nonrelease)` is the only type and defaults when
omitted. The seven dimensions are required. Its default pose is flat and
unfastened, with the tail outside the head and an undeflected locking pawl.

| Token | Property | Meaning |
| --- | --- | --- |
| `l` | `length` | Strap length, excluding the head |
| `w` | `width` | Full strap width |
| `t` | `thickness` | Maximum strap thickness |
| `head(x,y,z)` | `headLength`, `headWidth`, `headHeight` | Head dimensions along X, Y, Z |
| `toothp` | `toothPitch` | Axial sawtooth pitch |
| `type(...)` | `type` | `nonrelease` |

The lowercase property spellings are also accepted as individual dimension
tokens. Mixed aliases and repeated properties are rejected, including a head
tuple combined with an individual head dimension. Tokens and selectors are
case insensitive. Lengths accept numbers in millimeters or unit strings
(`mm`, `cm`, `m`, `in`, `inch`, `mil`, `ft`, `feet`) and normalize to millimeters.

## Fixed nominal construction

Let `L`, `W`, `T`, `P`, `HL`, `HW`, `HH` be strap length, width, thickness,
tooth pitch, and the three head dimensions. All omitted dimensions below are
fixed by this contract; `getCableTieDimensions` exposes them.

The origin is the center of the head's strap-exit edge at its bottom Z plane.
The strap runs along +X, its width is centered about Y = 0, and its bottom is
Z = 0. The head occupies X = `-HL .. 0`, Y = `-HW/2 .. HW/2`, Z = `0 .. HH`.
The strap joins the +X head face, occupying Z = `0 .. T`.

The final `2W` of strap length is a triangular plan-view insertion tip: it
starts at X = `L - 2W` with width W and tapers linearly and symmetrically to
zero width at X = L, retaining thickness T. The preceding strap is rectangular.
All exterior edges are sharp; radii, chamfers, and tip bevels are zero.

There are `N = floor((L - 2W)/P)` full-pitch tooth grooves on the +Z face,
starting at X = 0. For each `i = 0 .. N-1`, remove the triangular X/Z section
with vertices `(iP,T)`, `((i+1)P,3T/4)`, `((i+1)P,T)`, extruded along Y from
`-2W/5 .. +2W/5`. Thus tooth depth is T/4, tooth width is 4W/5, the ramp falls
toward +X, and the locking face is perpendicular to X. Any remainder between
the last complete groove and the tip is smooth. The side rails and the bottom
3T/4 of the strap remain continuous.

The head has a rectangular through passage along Z, centered at
X = `C = -HL/2`, Y = 0. Its X length is `A = 6T/5`, its Y width is `W + T/5`,
and its corners are square. Remove this full-height prism before adding the
integral locking pawl. Both passage openings are flush with the head faces.

The pawl joins the passage's -X wall. Define `B = C - A/2` and
`Z0 = HH/2 - T/4`. The pawl's X/Z polygon has vertices
`(B-T/2,Z0)`, `(B,Z0)`, `(B+T/4,Z0+T/2)`, `(B-T/2,Z0+T/2)`, extruded along Y
from `-2W/5 .. +2W/5`. Its embedded root is T/2 long, its axial thickness is
T/2, and its inclined tip protrudes T/4 into the passage. Insertion advances
from -Z toward +Z with the grooved strap face toward -X; the pawl's upper
shoulder catches a groove locking face on withdrawal. There is no release
lever or extra head cavity. Elastic deflection, material properties, and a
formed/fastened loop are outside this nominal pose contract.

## Compatibility

Dimensions must be positive and finite. At least one complete tooth must fit
before the tip, and N must be a safe integer. Head length must be at least
`6T/5 + T`; head width must be at least `W + T/5 + T`. These bounds leave
at least T/2 of material on each side of the passage and embed the pawl root.
Head height must be at least `2T`. Unknown properties, unsupported selectors,
incomplete numeric lengths, and nonfinite derived dimensions are rejected.

This repository defines the parameter contract. Geometry generation belongs
in `tscircuit/jscad-electronics`.
