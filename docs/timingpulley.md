# Timing pulley

```text
timingpulley_profile(t5)_teeth20_beltw10mm_clearance1mm_bore5mm_flangeh2mm_flanget1mm
```

A generic, two-flange, straight-bore pulley for a single-sided T5 timing belt.
Only `profile(t5)` is supported. T5 is the metric trapezoidal family associated
with DIN 7721; the name identifies no manufacturer. This contract pins a nominal
clearance construction, rather than claiming the count-specific DIN/ISO
machining profile or a manufacturer's tool-generated tooth shape.

| Parameter | Default | Meaning |
| --- | --- | --- |
| `teeth` / `toothcount` | 20 | Integer, 10 through 256 |
| `beltw` / `beltwidth` | 10 mm | Intended belt width |
| `clearance` / `sideclearance` | 1 mm | Positive axial clearance on each side |
| `bore` / `borediameter` | 5 mm | Straight through bore |
| `flangeh` / `flangeheight` | 2 mm | Radial height above the toothed outside diameter |
| `flanget` / `flangethickness` | 1 mm | Each flange's axial thickness |

Dimensions normalize to millimeters. Full numeric lengths can use mm, cm, m,
in, inch, mil, ft, or feet; names and selectors are case insensitive. Unknown,
duplicate, malformed, unsupported, and physically incompatible tokens fail.

The pitch is 5 mm and pitch diameter is `teeth * 5 / pi`. The tooth crest
outside diameter is pitch diameter minus 0.85 mm, keeping the tensile pitch
line 0.425 mm above the belt root/contact surface. Each groove has two straight
flanks at 25 degrees from its radial centerline, a flat root at 1.95 mm depth,
0.4 mm root fillets, and 0.6 mm entry fillets tangent to the outside circle.
The nominal flank lines intersect the outside-circle tangent plane with
3.32 mm separation; the rounded opening on the circle is derived from that
construction, not another width constraint. These constants remain fixed as
tooth count changes. Adjacent grooves repeat at `2*pi/teeth`, leaving real
circular crest lands. No hub, fasteners, keyway, taper, or bearing is implied.

The bore must be smaller than the root diameter. The flange height must exceed
the mating belt's 1 mm backing thickness. Face width is belt width plus twice
side clearance; flange diameter is outside diameter plus twice flange height.
Default pitch/outside/root diameters are 31.8309886, 30.9809886, and
27.0809886 mm; face width is 12 mm and total axial width is 14 mm.

The axis is +Z through X=Y=0. The toothed face occupies Z=0 through face width;
flanges occupy Z=-flange thickness through 0 and Z=face width through face
width+flange thickness. At phase zero a groove is centered on +X. Positive
angles run counterclockwise from +X. `getTimingPulleyDimensions` supplies all
fixed profile dimensions and derived radii/widths to renderers. It contains no
meshes. Tessellation belongs to jscad-electronics.

References: [KEIPER's DIN 7721 T-profile classification](https://www.keiperriemen.de/en/tooth-profiles.html),
[Wellpower's T5 nominal pulley profile table](https://wellpowerbelt.com/timing-belt-pulleys/),
and [MISUMI's T5 profile drawing](https://th.misumi-ec.com/en/pdf/fa/2015/p1_1451_002.pdf).
MISUMI notes that production groove dimensions vary with tooth count;
this contract deliberately specifies its own reproducible nominal construction.
