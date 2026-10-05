# ClampingShaftCollar

Roadmap [#13, proposal 0018](https://github.com/tscircuit/modelprinter/issues/13). This family specifies a custom nominal part; it does not imply a supplier series or an ISO body standard.

```ts
import { mp, getClampingShaftCollarDimensions } from "@tscircuit/modelprinter"

const model = mp.string("clampingshaftcollar_bore8mm_od18mm_w9mm_split1mm_mount(singleclamp)_m4").json()
if (model.fn !== "clampingshaftcollar") throw new Error("Unexpected family")
const { fn, ...props } = model
const dimensions = getClampingShaftCollarDimensions(props)
```

The schema is `clampingShaftCollarModelPropsSchema`; the definition schema is `clampingShaftCollarModelDefinitionSchema`. Input/output/definition TypeScript types are exported, and the family participates in `modelDefinitionSchema` and `modelprinter.getModelNames()`. The dimension helper accepts properties without `fn`, validates them, and supplies exact cutter locations and depths for a downstream renderer. Modelprinter owns this contract; geometry is generated elsewhere.

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
| `split` | `splitWidth` | Required slit width |
| `mount(...)` | `mount` | Fixed `singleclamp` |
| `screwz` | `screwZ` | `width / 2`, from the lower face |
| `clampx` | `clampX` | `(outerDiameter+boreDiameter)/4`, halfway across the radial wall on +X |
| `clearance` | `clearanceHoleDiameter` | Thread diameter + 0.5 mm |

The shaft axis is +Z. The datum is the center of the flat lower face at Z=0; the ring occupies Z=0 through `width`. The shaft bore is concentric and through. A rectangular slit removes the +X wall over X=0 to R=`outerDiameter/2`, Y=`-splitWidth/2` to `+splitWidth/2`, and the entire axial width. The opposite -X wall remains connected: this is a one-piece collar. The default pose is the uncompressed nominal gap. Both end faces are flat; the slit edges are sharp, with no other reliefs or head counterbores.

The clamp screw axis is +Y at X=`clampX`, Z=`screwZ`. It enters from -Y through an unthreaded clearance hole, crosses the slit, and engages the female threaded +Y arm. `getClampingShaftCollarDimensions` returns the slit bounds plus two cutter cylinders. For x=`clampX`, c=clearance diameter, d=thread diameter, and s=`splitWidth/2`:

- `clearanceHole`: start `[x,-sqrt(R^2-(x-c/2)^2),screwZ]`, direction `[0,1,0]`, diameter c, depth `sqrt(R^2-(x-c/2)^2)-s` (ends at the negative slit face).
- `threadedHole`: start `[x,s,screwZ]`, direction `[0,1,0]`, diameter d, depth `sqrt(R^2-(x-d/2)^2)-s` (fully breaks through the positive outside surface). The whole material-bearing positive arm is threaded.

The extents deliberately cover the curved outer surface across each cylinder's full diameter. Hole depth is a fixed through-arm construction, not a blind depth selected from the thread size. The thread hole carries pitch, hand, female gender, and class.

Validation requires OD > bore, clearance diameter > thread diameter, and `bore/2 < clampX-clearance/2` with `clampX+clearance/2 < OD/2`, so neither cylindrical hole intersects the shaft bore or the radial exterior edges. The slit width must be less than the bore diameter and must leave a positive arm thickness at the outermost clearance-cylinder edge. The clearance hole must fit strictly between both end faces and their chamfers. A chamfer must be smaller than half the radial wall and half the width; derived dimensions must be finite.
