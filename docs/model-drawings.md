# Model drawing references

Modelprinter can provide semantic measurement references alongside a model's
parameter contract. This metadata contains no meshes, rendered images, paper
layout, or renderer dependencies. Geometry generation and visual demonstrations
remain in jscad-electronics and the drawing exporter.

```ts
import { mp } from "@tscircuit/modelprinter"

const stock = mp.string("rectangulartube_w40mm_h20mm_wall3mm_l80mm")
const definition = stock.json()
const drawing = stock.drawing()
```

`.json()` retains its existing output. `.drawing()` is optional metadata: it
returns `undefined` for models that have no drawing contract, and validates the
model's parameters before invoking a registered drawing callback. The first
supported model is `rectangulartube`. Its helper is also public:

```ts
import { getRectangularTubeDrawing } from "@tscircuit/modelprinter"

const drawing = getRectangularTubeDrawing({
  width: 40,
  height: 20,
  wallThickness: 3,
  length: 80,
})
```

Named edges are authored analytic reference segments. Each has a stable `name`
and `start`/`end` points. Coordinates are model-local, right-handed CAD XYZ in
millimeters with +Z up; points acquire rotation and translation when core places
the model. A segment may be a nominal-envelope datum rather than an edge of the
final mesh or a B-rep topological edge. Names never depend on tessellation,
triangle order, or inferred vertex indices.

For rectangular tube, the cross-section is centered on XY and the cut ends are
Z=0 and Z=length. The 40 × 20 × 80 mm stock above provides:

| Reference | Start (mm) | End (mm) | Nominal measurement |
| --- | --- | --- | --- |
| `overall_width` | (−20, 10, 0) | (20, 10, 0) | 40 mm |
| `overall_height` | (−20, −10, 0) | (−20, 10, 0) | 20 mm |
| `overall_length` | (20, −10, 0) | (20, −10, 80) | 80 mm |
| `wall_thickness` | (0, 7, 0) | (0, 10, 0) | 3 mm |

These coordinates update from the normalized parameters. Rounded tubes retain
the same semantic names and nominal envelope spans: `overall_width` and
`overall_height` do not shrink to the straight portions between rounded corners.
They measure the nominal stock dimensions, not tessellated feature lengths.

`views` supplies suggested end (`z+`) and side (`y-`) views, with dimension intents
referencing those edge names. Each intent has `edgeRef`, `orientation`, `offset`,
and `precision`. Orientations are `horizontal`, `vertical`, or `aligned`
(default). Offset is signed paper-space mm after projection (default 8); it
positions the dimension line and never changes the measured value. Precision is
the number of decimal places from 0 to 6 (default 1). The metadata does not fix a
viewport size, projection scale, dimension text, or units label.

The intended authoring flow lets core expose these names on the selected model
so dimension TSX can remain conventional:

```tsx
<assembly.drawing.partview partRef=".stock" name="end" direction="z+"
  width="80mm" height="60mm">
  <assembly.drawing.dimension edgeRef="overall_width"
    orientation="horizontal" offset="10mm" />
  <assembly.drawing.dimension edgeRef="overall_height"
    orientation="vertical" offset="10mm" />
</assembly.drawing.partview>
```

This illustrates the dimension proposal; modelprinter does not register TSX
elements, place a model, transform references into world coordinates, or resolve
Circuit JSON IDs. Those are downstream core responsibilities. The exporter
projects resolved references and renders extension lines, arrows, and measured
values. Initial references are straight segments; circles, diameters, radii,
angular dimensions, tolerances, and mesh topology naming remain follow-up work.

## Add metadata to a model

Implement a pure helper beside the model's schema and export it from the model's
public `index.ts`. Add an optional typed callback to its registration descriptor:

```ts
export const model = defineModel({
  name: "rectangulartube",
  schema: rectangularTubeModelDefinitionSchema,
  parse: parseRectangularTubeModelParams,
  getDrawing: ({ fn, ...props }) => getRectangularTubeDrawing(props),
})
```

The callback receives that model's validated definition. Metadata must have
unique nonempty edge and view names, finite nonzero segments, and dimension
references resolving to an edge in the same contract. The registry validates and
copies the result with `modelDrawingSchema`; it snapshots the callback when
registered, so changing a descriptor cannot change another registry's contract.
