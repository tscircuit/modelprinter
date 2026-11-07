# Triangular bar

```text
triangularbar_side20mm_l100mm_equilateral_cornerr0mm
```

Solid equilateral triangular stock with three longitudinal flat faces and flat
end planes. The nominal sharp triangle's centroid is the XY origin, its base is
parallel to X at negative Y, and its opposite vertex lies on positive Y. The
extrusion runs from Z=0 to Z=length.

| Property | Tokens | Meaning |
| --- | --- | --- |
| `sideLength` | `side`, `sidelength` | Nominal sharp triangle side; required, positive |
| `length` | `l`, `length` | Axial length; required, positive |
| `equilateral` | `equilateral` | Value-free flag, always true; defaults to true |
| `cornerRadius` | `cornerr`, `cornerradius` | Equal longitudinal corner fillet radius; defaults to 0 |

Lengths normalize to millimeters. Complete decimal strings accept `mm`, `cm`,
`m`, `in`, `inch`, `mil`, `ft` and `feet`, or no unit (millimeters). Tokens and
units are case insensitive and tokens may be reordered. Unknown tokens,
duplicate properties (including aliases), repeated/valued flags and malformed
lengths are rejected. Props and definition schemas are strict.

The value-free `equilateral` flag replaces the provisional `shape(equilateral)`
roadmap selector. Old `shape(...)` tokens and `shape` props are rejected, as are
other triangle shapes and `equilateral: false`.

For nominal side s, sharp height H=s*sqrt(3)/2 and inradius R=H/3, the nominal
vertices are (-s/2,-R), (s/2,-R) and (0,2R). Each 60-degree corner is replaced by
a circular arc of radius r, tangent to its two adjacent sides. The tangent
setback along each side is sqrt(3)*r, leaving straight face width
s-2*sqrt(3)*r. Require 0<=r<R and positive finite derived dimensions, preserving
all three flat faces. A radius equal to the inradius would collapse those faces.

Rounding keeps the nominal centroid fixed but shrinks the actual envelope:
width=s-2*(sqrt(3)-1)*r, height=H-r, minY=-R and maxY=2R-r. Its inradius stays
R and its actual circumradius is 2R-r. Thus the rounded
bounding box is not centered vertically on the origin. The end planes remain
flat with no axial fillets or chamfers.

`getTriangularBarDimensions` returns normalized props, `nominalHeight`,
`inradius`, `circumradius`, `straightSideLength`, `profileWidth`, `profileHeight`,
`size`, `bounds.min`/`bounds.max`, `bottomZ` and `topZ`. Size and bounds describe
the rounded profile. For s=12, r=1 and length=100, width is 14-2*sqrt(3), height
is 6*sqrt(3)-1, minY=-2*sqrt(3) and maxY=4*sqrt(3)-1, in millimeters.

No holes, taper, coatings or manufacturing tolerances are implied. Geometry
generation belongs in `jscad-electronics`.

Roadmap: [modelprinter #13, item 0944](https://github.com/tscircuit/modelprinter/issues/13#issuecomment-5977317182).
