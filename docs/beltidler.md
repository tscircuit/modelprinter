# Belt idler

```text
beltidler_shape(smooth)_od20mm_bore5mm_beltw10mm_beltt2.2mm_clearance1mm_flangeh3mm_flanget1mm
```

A generic smooth, two-flange roller with a straight through bore for contact
with a timing belt's smooth back. Only `shape(smooth)` is supported. It is a
roller envelope with explicit dimensions, not a named bearing assembly;
no rolling elements, races, seals, shaft, hub, or tooth-meshing capability is
implied. Diameter selection and belt bending limits belong to the application.

| Parameter | Default | Meaning |
| --- | --- | --- |
| `od` / `outerdiameter` | 20 mm | Smooth contact surface diameter |
| `bore` / `borediameter` | 5 mm | Straight through bore |
| `beltw` / `beltwidth` | 10 mm | Intended belt width |
| `beltt` / `beltthickness` | 2.2 mm | Complete thickness outside the contact surface |
| `clearance` / `sideclearance` | 1 mm | Positive axial gap on each side of the belt |
| `flangeh` / `flangeheight` | 3 mm | Flange's radial rise above contact surface |
| `flanget` / `flangethickness` | 1 mm | Thickness of each flange |

All lengths must be positive; the bore must be smaller than contact diameter.
Flange rise must exceed the complete belt thickness, so the teeth projecting
outward from backside contact clear the flange rim. Face width is belt width
plus twice side clearance. Default contact/flange diameters are 20 and 26 mm;
face width is 12 mm and total width is 14 mm. The 2.2 mm belt default corresponds
to the basic T5 section but may be changed for another belt. This smooth roller
has no profile or tooth pitch.

The axis is +Z at X=Y=0. The smooth face occupies Z=0..face width; flanges lie
at -flange thickness..0 and face width..face width+flange thickness. A centered
belt spans Z=side clearance..side clearance+belt width. Square flange shoulders
and flat annular ends are fixed construction details. `getBeltIdlerDimensions`
returns contact radius, flange diameter, wall and above-belt clearance, widths
and end datum planes.

Length tokens normalize to millimeters and accept mm, cm, m, in, inch, mil, ft,
and feet. Names/selectors are case insensitive; duplicate aliases and unknown,
malformed or unsupported tokens fail. This is an explicitly dimensioned generic
roller, not a DIN claim or manufacturer-specific part number. See
[HPC Europe's timing-belt catalog](https://www.hpceurope.com/docFichesTechniques/Belts.pdf)
for the referenced T5 basic belt thickness and smooth-back idler application.
