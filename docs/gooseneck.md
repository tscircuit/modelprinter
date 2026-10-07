# Gooseneck

A generic hollow gooseneck reference for lamps, camera arms and wire conduits.
The pose consists of a straight section, one circular bend, and a second
straight section. It describes the installed envelope, not spring mechanics,
load capacity, a supplier part, or a minimum safe bending radius.

```ts
import { mp, getGooseneckDimensions, getGooseneckFrame } from "@tscircuit/modelprinter"

const definition = mp.string(
  "gooseneck_od6mm_id4mm_start38mm_end112mm_radius60mm_angle90_pitch2.25mm_depth0.25mm",
).json()
if (definition.fn !== "gooseneck") throw new Error("Expected gooseneck")
const { fn, ...props } = definition

getGooseneckDimensions(props) // totalLength ≈ 244.248 mm
getGooseneckFrame(props, 0) // position [0, 0, 0], tangent [0, 0, 1]
```

| Token | Property | Default | Meaning |
| --- | --- | --- | --- |
| `od` | `outerDiameter` | 6 mm | Outside diameter at rib crests |
| `id` | `innerDiameter` | 4 mm | Nominal continuous bore |
| `start` | `startLength` | 38 mm | First straight length, may be zero |
| `end` | `endLength` | 112 mm | Last straight length, may be zero |
| `radius` | `bendRadius` | 60 mm | Bend centerline radius |
| `angle` | `bendAngle` | 90 | Unitless degrees, 0–180 inclusive |
| `pitch` | `ribPitch` | 2.25 mm | Distance along centerline between rib crests |
| `depth` | `ribDepth` | 0.25 mm | Radial crest-to-root depth; zero for smooth |

Lengths accept numbers in millimeters or unit-bearing strings. Unknown,
duplicate and malformed tokens are rejected. The root diameter must exceed
the bore diameter. For a nonzero bend, the bend radius must exceed half the
outside diameter. Total centerline length must be positive and finite.

The first open end is centered on the origin in the XY plane. Its centerline
starts along +Z, bends toward +X in the XZ plane, then continues along the
final tangent. At 90 degrees the terminal center is
`[bendRadius + endLength, 0, startLength + bendRadius]`.
`getGooseneckFrame` returns the position, tangent and in-plane normal at any
centerline distance; +Y is the other section axis. Use assembly transforms
to position or mirror the entire model. The ribs are annular visualization
details, not a helical strip or thread.

The outer radius at centerline distance `s` is
`od/2 - depth/2 * (1 + cos(2*pi*s/pitch))`. Ribs start at a root at `s=0`;
the final rib is trimmed at the requested total length. The bore stays smooth.
Geometry is tessellated by jscad-electronics, so round surfaces have chordal
approximation error. No end fittings, wires, or mounting hardware are included.

```text
gooseneck_od6mm_id4mm_start150mm_end0mm_radius60mm_angle0_pitch2.25mm_depth0.25mm
gooseneck_od8mm_id5mm_start20mm_end20mm_radius30mm_angle180_pitch3mm_depth0mm
```
