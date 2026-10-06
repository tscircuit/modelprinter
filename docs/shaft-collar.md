# ShaftCollar

Roadmap [#13, proposal 0017](https://github.com/tscircuit/modelprinter/issues/13). This family specifies a custom nominal part; it does not imply a supplier series or an ISO body standard.

```ts
import { mp, getShaftCollarDimensions } from "@tscircuit/modelprinter"

const model = mp.string("shaftcollar_bore8mm_od16mm_w8mm_mount(setscrew)_m4").json()
if (model.fn !== "shaftcollar") throw new Error("Unexpected family")
const { fn, ...props } = model
const dimensions = getShaftCollarDimensions(props)
```

The schema is `shaftCollarModelPropsSchema`; the definition schema is `shaftCollarModelDefinitionSchema`. Input/output/definition TypeScript types are exported, and the family participates in `modelDefinitionSchema` and `modelprinter.getModelNames()`. The dimension helper accepts properties without `fn`, validates them, and supplies exact cutter locations and depths for a downstream renderer. Modelprinter owns this contract; geometry is generated elsewhere.

All lengths normalize to millimeters. Numbers mean millimeters; strings accept a complete decimal with an optional `mm`, `cm`, `m`, `in`, `inch`, `mil`, `ft`, or `feet` suffix. Angles are degrees. Model strings are case insensitive; selectors require parentheses. Unknown fields/tokens, duplicate tokens (including aliases), missing required values, unrecognized units, trailing text, nonfinite values, and incompatible dimensions fail validation. Counts are unitless integers.

The `_mN` token controls the female clamping/set-screw thread, not the axial shaft bore. It selects nominal ISO metric diameter, coarse pitch, and right hand. Supported nominal sizes/coarse pitches (mm): M2/0.4, M2.5/0.45, M3/0.5, M4/0.7, M5/0.8, M6/1, M8/1.25, M10/1.5, M12/1.75. `_threadpitch0.5mm` and `_threadhand(left)` override pitch and hand; pitch must be positive and less than diameter. `_threadclass(6H)` is the sole supported internal class and defaults to 6H. The contract defines nominal threaded cylindrical holes; tolerances and helical thread root/crest relief are not encoded. No screw is included.

| Token | JSON property | Default/meaning |
| --- | --- | --- |
| `bore` | `boreDiameter` | Required, plain shaft bore |
| `od` | `outerDiameter` | Required, cylindrical exterior |
| `m` | `metricSize` | Required, female mounting thread |
| `threadpitch` | `threadPitch` | Coarse pitch for `metricSize` |
| `threadhand(...)` | `threadHand` | `right`; also accepts `left` |
| `threadclass(...)` | `threadClass` | Fixed `6H` |
| `chamfer` | `chamfer` | 0; equal 45-degree radial/axial setbacks at both outer end edges and both bore entries |
| `w`, `width` | `width` | Required axial width |
| `mount(...)` | `mount` | Fixed `setscrew` |
| `screwz` | `screwZ` | `width / 2`, from the lower face |
| `screwangle` | `screwAngle` | 0; counterclockwise from +X about +Z, normalized to [0, 360) |

The shaft axis is +Z. The mounting datum is the center of the flat lower face at Z=0; the ring occupies Z=0 through `width`. The bore is concentric and through. Both end faces are flat, with no other grooves, fillets, or chamfers.

There is exactly one radial hole, aimed inward from the exterior toward the shaft axis. Let R=`outerDiameter/2`, r=`boreDiameter/2`, d=thread diameter, and a=`screwAngle`. `getShaftCollarDimensions` returns `wallThickness=R-r` and `screwHole` with start `[R*cos(a), R*sin(a), screwZ]`, unit direction `[-cos(a), -sin(a), 0]`, diameter d, and depth `R-sqrt(r*r-(d/2)^2)`. This depth breaks into the axial bore across the full cutter diameter, rather than stopping at its nearest tangent. The returned hole also carries pitch, hand, female gender, and class. The complete material-bearing radial bore is threaded.

Validation requires OD > bore > thread diameter; the hole must fit strictly between both end faces and their chamfers (`chamfer < screwZ-d/2` and `screwZ+d/2 < width-chamfer`). A chamfer must be smaller than half the radial wall and half the width. Every derived dimension must remain finite.
