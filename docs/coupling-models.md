# Couplings and straight bevel gear

These are generic industrial component families. They use explicit dimensions rather than a manufacturer part number. Length fields accept finite numbers in millimeters or decimal strings with `mm`, `cm`, `m`, `in`, `inch`, `mil`, `ft`, or `feet`. Counts and the bridge angle accept unitless numbers. Unknown properties, unknown string tokens, duplicate aliases, malformed values, and impossible geometric relationships fail validation.

All models are centered on the Z shaft axis. Bottom datum is Z=0. Hubs and shaft bores are real geometry; the universal joint is in its straight pose. The following complete strings also give the defaults.

| Model | Full default model string |
| --- | --- |
| `jawcoupling` | `jawcoupling_od30mm_l40mm_bore8mm_hubl12mm_jawd12mm_jawcount3` |
| `beamcoupling` | `beamcoupling_od25mm_l30mm_bore8mm_hubl7mm_slotw1mm_slots6_bridgeangle60` |
| `oldhamcoupling` | `oldhamcoupling_od30mm_l36mm_bore8mm_hubl12mm_slotw7mm_slotd3mm_clearance0.2mm` |
| `universaljoint` | `universaljoint_od30mm_l60mm_bore8mm_hubl14mm_armt5mm_crossd6mm_clearance0.2mm` |
| `bevelgear` | `bevelgear_od40mm_td24mm_h14mm_bore8mm_depth3mm_hubd20mm_hubh8mm_teeth16` |

| Family | Normalized properties and aliases | Features and constraints |
| --- | --- | --- |
| Jaw coupling | `outerDiameter` (`od`), `length` (`l`), `boreDiameter` (`bore`), `hubLength` (`hubl`), `jawDepth` (`jawd`), `jawCount` (`jawcount`) | Two interleaved jaw hubs and a separate radial spider; `jawCount` is 3–12 per hub. Jaw depth must exceed half the central gap and cannot reach the opposite hub. Bore diameter must be less than 70% of the outside diameter. |
| Beam coupling | `outerDiameter` (`od`), `length` (`l`), `boreDiameter` (`bore`), `hubLength` (`hubl`), `slotWidth` (`slotw`), `slotCount` (`slots`, `slotcount`), `bridgeAngle` (`bridgeangle`) | 2–20 staggered transverse slots, rotated 90 degrees successively, leave a 20–120 degree intact bridge at each station. The slots must leave axial material between cuts and solid end hubs. This models a slotted flexure, not a continuous helical cut. |
| Oldham coupling | `outerDiameter` (`od`), `length` (`l`), `boreDiameter` (`bore`), `hubLength` (`hubl`), `slotWidth` (`slotw`), `slotDepth` (`slotd`), `clearance` (`clearance`) | Orthogonal hub face slots and matching center-disk tongues. Disk diameter is 88% of the outside diameter; disk thickness is the central gap minus twice the clearance. Slots leave a hub floor and side walls. Clearance can be zero. |
| Universal joint | `outerDiameter` (`od`), `length` (`l`), `boreDiameter` (`bore`), `hubLength` (`hubl`), `armThickness` (`armt`), `crossDiameter` (`crossd`), `clearance` (`clearance`) | Orthogonal forks, transverse journal holes, and a solid four-arm cross centered at Z=`length/2`. Fork ear width is 1.8 times cross diameter. Constraints ensure the forks clear one another and leave material around shaft and journal bores. Clearance can be zero. |
| Straight bevel gear | `outerDiameter` (`od`), `topDiameter` (`td`), `height` (`h`), `boreDiameter` (`bore`), `toothDepth` (`depth`), `hubDiameter` (`hubd`), `hubHeight` (`hubh`), `teeth` (`teeth`) | 6–96 teeth taper toward the small face; a bored hub extends from Z=`height` to Z=`height+hubHeight`. Tooth roots leave positive material around the bore and the hub fits on the small face. The tooth shape is a nominal trapezoidal envelope for assembly visualization, not a conjugate manufacturing profile. |

Full lowercase property names are accepted as aliases for the length fields, for example `outerdiameter30mm` and `hubheight8mm`.

The public API exports each family's `...ModelPropsInput`, normalized `...ModelProps`, discriminated `...ModelDefinition`, `...ModelPropsSchema`, `...ModelDefinitionSchema`, and `get...Dimensions`. The dimension helpers include normalized properties, nominal `size`, bottom/top Z datums, and the central gap, slot pitch, disk/tongue dimensions, cross dimensions, or gear root diameters as appropriate.

```ts
import { mp, getOldhamCouplingDimensions } from "@tscircuit/modelprinter"

mp.string("oldhamcoupling_od3cm_l36mm_bore8mm").json()
getOldhamCouplingDimensions({ outerDiameter: "3cm", length: 36 })
```

Geometry and visual regressions are maintained in the paired jscad-electronics renderer.
