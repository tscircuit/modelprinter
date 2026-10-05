# RigidCoupler

Roadmap [#13, proposal 0019](https://github.com/tscircuit/modelprinter/issues/13). This family specifies a custom nominal part; it does not imply a supplier series or an ISO body standard.

```ts
import { mp, getRigidCouplerDimensions } from "@tscircuit/modelprinter"

const model = mp.string("rigidcoupler_bore8mm_od20mm_l25mm_mount(setscrew)_screwcount4_m4").json()
if (model.fn !== "rigidcoupler") throw new Error("Unexpected family")
const { fn, ...props } = model
const dimensions = getRigidCouplerDimensions(props)
```

The schema is `rigidCouplerModelPropsSchema`; the definition schema is `rigidCouplerModelDefinitionSchema`. Input/output/definition TypeScript types are exported, and the family participates in `modelDefinitionSchema` and `modelprinter.getModelNames()`. The dimension helper accepts properties without `fn`, validates them, and supplies exact cutter locations and depths for a downstream renderer. Modelprinter owns this contract; geometry is generated elsewhere.

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
| `boreb` | `boreBDiameter` | Same as `boreDiameter`; independent shaft-B bore |
| `l`, `length` | `length` | Required overall axial length |
| `mount(...)` | `mount` | Fixed `setscrew` |
| `screwcount` | `screwCount` | Fixed 4 (two per shaft end) |
| `screwendoffset` | `screwEndOffset` | `length / 4`, measured inward from each end |
| `screwangle` | `screwAngle` | 0; first hole counterclockwise from +X about +Z, normalized to [0,360) |

The shaft axis is +Z, with the mounting datum at the center of end A at Z=0. The sleeve occupies Z=0 through `length`; end B is at Z=`length`. Both shaft bores are coaxial. Bore A runs from 0 to `length/2`; bore B runs from `length/2` to `length`. Equal diameters form one continuous plain bore; unequal diameters form a sharp concentric shoulder at the midpoint. End chamfers affect the outer end edges and the respective bore entries; the middle shoulder stays square. The sleeve has flat ends, no central shaft stop, keyway, slots, or other radii.

There are exactly two radial set-screw holes per end. End A's plane is Z=`screwEndOffset`; end B's is Z=`length-screwEndOffset`. At each plane the first hole lies at `screwAngle` and the second at `screwAngle+90` degrees. The 90-degree separation fixes the layout; four equally spaced holes in one plane are a different construction and are rejected by this family.

`getRigidCouplerDimensions` returns both bore depths (`length/2`) and `screwHoles`, ordered A-first, A-second, B-first, B-second. For each hole, R=`outerDiameter/2`, r=its shaft bore radius, d=thread diameter, and a=its angle. The cutter starts at `[R*cos(a),R*sin(a),z]`, points inward along `[-cos(a),-sin(a),0]`, has diameter d, and depth `R-sqrt(r*r-(d/2)^2)`. This fully opens into the corresponding shaft bore; the complete material-bearing hole is threaded. Each returned hole carries pitch, hand, female gender, and class.

Validation requires both bores smaller than OD and strictly larger than `sqrt(2)*threadDiameter`. This retains material between the two perpendicular screw holes outside each shaft bore; smaller shaft bores would let those holes intersect in the sleeve wall. Holes must clear end chamfers (`screwEndOffset-d/2 > chamfer`) and the two end planes must be separated by more than d (`length-2*screwEndOffset > d`). These conditions keep each hole fully inside its own half and prevent axial overlap. Chamfers must be smaller than half the thinnest radial wall and half the length. Every derived dimension must remain finite.
