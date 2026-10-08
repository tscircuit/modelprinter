# Solid rivet

`solidrivet` describes an unset, solid cylindrical rivet with a spherical-cap
head and a flat tail (roadmap #13, item 0036). This is a custom nominal geometry,
not a claim of conformance to a fastener standard. It has no hole, mandrel,
threads, chamfers, head fillet, or deformed closing head. Geometry generation
belongs in jscad-electronics.

```ts
import { getSolidRivetDimensions, mp } from "@tscircuit/modelprinter"

mp.string("solidrivet_d3mm_l10mm_headod5.5mm_headh2.2mm_roundhead_flattail_unset").json()

// The original roadmap selectors are accepted as equivalent input.
mp.string("solidrivet_spec(custom)_d3mm_l10mm_head(round)_headod5.5mm_headh2.2mm_tail(flat)_state(unset)").json()

getSolidRivetDimensions({ diameter: 3, length: 10, headDiameter: 5.5, headHeight: 2.2 })
```

| Property | Default | Tokens | Meaning |
| --- | --- | --- | --- |
| `diameter` | Required | `d`, `diameter` | Solid shank diameter |
| `length` | Required | `l`, `length` | Under-head length, excluding the head |
| `headDiameter` | Required | `headod`, `headdiameter` | Head diameter at the bearing plane |
| `headHeight` | Required | `headh`, `headheight` | Spherical-cap height above the bearing plane |
| `specification` | `"custom"` | `spec(custom)` | Explicitly dimensioned custom construction |
| `roundHead` | `true` | `roundhead`, `head(round)` | Spherical-cap head |
| `flatTail` | `true` | `flattail`, `tail(flat)` | Flat unpeened tail |
| `unset` | `true` | `unset`, `state(unset)` | Rivet before installation/deformation |

All four dimensions are required; no fastener size is inferred. Lengths accept
finite numbers in millimeters or complete numeric strings with optional `mm`,
`cm`, `m`, `in`, `inch`, `mil`, `ft`, or `feet` units. Outputs are millimeters.
Token names, unit suffixes, and selector values are case insensitive. Direct
schema property names and selector values use the casing in the table.

The exported strict props and definition schemas reject unknown properties,
nonpositive/nonfinite dimensions, and any alternative head/tail/state. The head
diameter must exceed the shank diameter. The head height must not exceed half
the head diameter: the allowed spherical caps range from a shallow dome through
a hemisphere, without an overhanging bulb. Derived dimensions must remain finite.
Duplicate dimensions, aliases, flags, and equivalent flag/selector combinations
are rejected, even when their values agree.

The local frame is right handed, in millimeters, with the shank concentric with
Z. Its bearing plane is at Z=0, the flat tail at Z=-`length`, and the head tip at
Z=`headHeight`. The shank and head are joined at the bearing plane. X and Y span
the circular cross-section; no angular orientation is preferred.

`getSolidRivetDimensions` returns the four normalized dimensions plus:

| Dimension | Definition |
| --- | --- |
| `overallLength` | `length + headHeight` |
| `headSphereRadius` | `headHeight / 2 + headDiameter² / (8 × headHeight)` |
| `headSphereCenterZ` | `headHeight - headSphereRadius` |
| `shankBottomZ` | `-length` |
| `headTopZ` | `headHeight` |

The spherical cap is the portion of this sphere at Z≥0; its intersection with
the bearing plane is a circle of diameter `headDiameter`. These Z values are
positions in the stated local frame, not directions. Tolerances, load capacity,
material, and installation forces are outside this parameter contract.

`SolidRivetModelPropsInput` accepts unit strings and optional defaults;
`SolidRivetModelProps` contains normalized lengths and resolved flags.
`SolidRivetModelDefinition` adds `fn: "solidrivet"` and participates in the
generated public model-definition union.
