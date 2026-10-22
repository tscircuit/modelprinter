# Model drawing references

Modelprinter supplies optional drawing metadata alongside a model's parameter
contract. Models explicitly name their geometric edges. Separate boolean view
presets request inferred overall measurements; an inferred width is never an
imaginary edge named `overall_width`.

This metadata contains no meshes, rendered images, paper layout, or renderer
dependencies. Geometry generation and visual demonstrations remain downstream in
jscad-electronics and the drawing exporter.

```ts
import { mp } from "@tscircuit/modelprinter"

const stock = mp.string("rectangulartube_w40mm_h20mm_wall3mm_l80mm")
const definition = stock.json()
const drawing = stock.drawing()
```

`.json()` retains its existing output. `.drawing()` returns `undefined` for models
that have no drawing contract. It validates the model's parameters before
invoking its registered callback. The first provider is `rectangulartube`; its
helper is also public:

```ts
import { getRectangularTubeDrawing } from "@tscircuit/modelprinter"

const drawing = getRectangularTubeDrawing({
  width: 40,
  height: 20,
  wallThickness: 3,
  length: 80,
})
```

## Named model edges

Every named edge has a stable `name` and `start`/`end` points explicitly defined
by the model. Names are identifiers such as `outer_top`; a dimension references
one with the scoped selector `.outer_top`. References resolve only against the
selected model's declared names. Bare labels such as `outer_top`, undeclared
selectors, duplicate names, and zero-length segments are rejected.

Coordinates are model-local, right-handed CAD XYZ in millimeters with +Z up.
Points acquire rotation and translation when core places the model. The
rectangular tube's cross-section is centered on XY and its cut ends lie at Z=0
and Z=length. For sharp 40 × 20 × 80 mm stock:

| Defined edge | Start (mm) | End (mm) | Edge length |
| --- | --- | --- | --- |
| `outer_top` | (−20, 10, 0) | (20, 10, 0) | 40 mm |
| `outer_left` | (−20, −10, 0) | (−20, 10, 0) | 20 mm |
| `outer_right_longitudinal` | (20, −10, 0) | (20, −10, 80) | 80 mm |

The model updates these edges from normalized parameters. A rounded profile's
cross-section straight edges stop at the corner tangencies. With a 4 mm outer
radius, `outer_top` is (−16, 10, 0) → (16, 10, 0), a 32 mm edge; `outer_left` is
(−20, −6, 0) → (−20, 6, 0), a 12 mm edge. The longitudinal reference follows the
outer-right lower tangent at X=20, Y=−6, from Z=0 to Z=80. It is an authored
analytic surface-boundary reference, not a promise about triangle indices or a
particular renderer's B-rep topology.

There is no named wall-thickness midpoint span: that would be a measurement datum
rather than a model edge. No overall envelope span is presented as an actual
straight edge when rounded corners shorten it.

The declaration and usage are distinct:

```ts
// The model explicitly defines this edge in its drawing metadata.
const namedEdge = {
  name: "outer_top",
  start: { x: -20, y: 10, z: 0 },
  end: { x: 20, y: 10, z: 0 },
}
```

```tsx
// Future core resolves this selector against the selected stock model.
<assembly.drawing.partview partRef=".stock" name="end" direction="z+"
  width="80mm" height="60mm">
  <assembly.drawing.dimension edgeRef=".outer_top" offset="10mm" />
</assembly.drawing.partview>
```

This illustrates the dimension proposal. Modelprinter does not register TSX
components or resolve Circuit JSON IDs; those remain downstream core work.

## Inferred view dimensions

Each dimension intent must select exactly one of:

| Intent | Meaning |
| --- | --- |
| `edgeRef: ".outer_top"` | Measure a named edge the selected model explicitly defines. |
| `widthOfView: true` | Infer the horizontal span of the complete projected view. |
| `heightOfView: true` | Infer the vertical span of the complete projected view. |

A `false` preset, multiple selectors, or no selector is invalid. The stock-tube
provider suggests width and height presets for its end (`z+`) view, plus a height
preset for its side (`y-`) view. These infer the nominal projected envelope even
when a rounded profile has shorter straight edges.

```tsx
<assembly.drawing.partview partRef=".stock" name="end" direction="z+"
  width="80mm" height="60mm">
  <assembly.drawing.dimension widthOfView offset="10mm" />
  <assembly.drawing.dimension heightOfView offset="10mm" />
</assembly.drawing.partview>
```

Metadata canonicalizes width to horizontal orientation and height to vertical.
The schema accepts those matching canonical orientations on re-parse, and rejects
conflicting orientations. Explicit edge intents support `horizontal`, `vertical`,
or `aligned` (default). Offset is signed paper-space mm after projection (default
8); it positions the dimension line without changing its value. Precision is 0–6
decimal places (default 1). Suggested views do not fix viewport size, paper scale,
measurement text, or units labels. A provider may expose presets with an empty
`namedEdges` array; view inference does not require inventing reference names.

Core will transform the explicitly declared edges to world coordinates and emit
resolved dimension records. The drawing exporter projects edges or view bounds
and draws extension lines, arrows, and measured values. Initial edge references
are straight segments; circles, diameters, radii, angular dimensions, tolerances,
and automatic topology naming remain follow-up work.

## Add metadata to a model

Implement a pure helper beside the model's schema and export it from the model's
public `index.ts`. Add a typed callback to its registration descriptor:

```ts
export const model = defineModel({
  name: "rectangulartube",
  schema: rectangularTubeModelDefinitionSchema,
  parse: parseRectangularTubeModelParams,
  getDrawing: ({ fn, ...props }) => getRectangularTubeDrawing(props),
})
```

The callback receives the model's validated definition. Metadata must have unique
nonempty edge/view names, finite nonzero segments, and explicit edge selectors
that resolve to a declared name in that contract. The registry validates and
copies the result with `modelDrawingSchema`; it snapshots the callback when
registered so modifying a descriptor does not change another registry's contract.
