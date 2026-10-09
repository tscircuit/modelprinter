# Threaded rod

`threadedrod` defines a straight, fully threaded metric rod with flat end planes.
It produces dimensions and validated model definitions for mechanical layout.
Geometry belongs in jscad-electronics. The nominal 60-degree ISO metric external
thread profile has no manufacturing tolerances, thread runout, or end relief.

```ts
import { getThreadedRodDimensions, mp, threadedRodModelPropsSchema } from "@tscircuit/modelprinter"

mp.string("threadedrod_m6_l100mm_chamfer0.5mm").json()
mp.string("threadedrod_m6_l100mm_threadpitch0.5mm_lefthanded").json()
threadedRodModelPropsSchema.parse({ metricSize: "M6", length: "10cm" })
getThreadedRodDimensions({ metricSize: "M6", length: 100, chamfer: 0.5 })
```

| Property | Default | Token | Meaning |
| --- | --- | --- | --- |
| `spec` | `"custom"` | Omit | Nominal custom dimensions; no specification selector is needed |
| `metricSize` | Required | `m6` | Nominal major diameter; supported sizes below |
| `length` | Required | `l`, `length` | Overall length, including the end chamfers |
| `thread` | `"full"` | Omit, or `_fullthread` | Thread runs along the complete rod; partial threads are unsupported |
| `ends` | `"flat"` | Omit | Two flat perpendicular end planes |
| `chamfer` | 0 mm | `chamfer` | Axial and radial setbacks of both 45-degree outside end chamfers |
| `threadPitch` | Coarse pitch for size | `threadpitch` | Positive axial pitch; explicitly set for fine threads |
| `threadHand` | `"right"` | Omit for right-hand threads; `_lefthanded` for left-hand threads | Single-start thread handedness |

`threadedRodCoarsePitches` supplies the supported sizes and coarse pitch in mm:
M2: 0.4, M2.5: 0.45, M3: 0.5, M4: 0.7, M5: 0.8, M6: 1, M8: 1.25,
M10: 1.5, M12: 1.75, M16: 2, M20: 2.5. This selected table is not a tolerance
or standards-compliance specification. A metric token has a unitless nominal
size; unsupported sizes require a future extension to this contract.

Lengths accept finite numbers in millimeters or complete numeric strings with
optional `mm`, `cm`, `m`, `in`, `inch`, `mil`, `ft`, or `feet` units. All output
lengths are millimeters. Model-string tokens and flags are case-insensitive;
direct properties use the names and literal-value casing shown above. Flags are
value-free, so use `_lefthanded` rather than `_threadhand(left)`. Unknown
properties, malformed values, duplicate tokens, and duplicate aliases are rejected.

The JSON properties `spec`, `thread`, `ends`, and `threadHand` are retained for
compatibility with existing renderers. Legacy strings using `spec(custom)`,
`thread(full)`, `ends(flat)`, or `threadhand(right)` / `threadhand(left)` also
remain accepted. Prefer the concise strings above and omit redundant defaults.
The `_custom`, `_flatends`, and `_righthanded` compatibility flags normalize away;
`_fullthread` is optional. Repeating a flag or combining it with a selector for the
same property is an error, even when the values agree. See
[Mechanical model string flags](model-string-flags.md) for the shared convention.

The rod is centered on the Z axis, with the first end plane at Z=0 and the other
at Z=`length`. Chamfers stay inside these planes; they do not add length.
A right-hand thread advances from +X toward +Y as Z increases; a left-hand
thread reverses this progression. Thread phase is zero at +X on the Z=0 plane.
The pitch is also the lead because only single-start threads are supported.

`getThreadedRodDimensions` returns `diameter`, `length`, `threadPitch`,
`pitchDiameter = diameter - 0.649519 * threadPitch`,
`minorDiameter = diameter - 1.226869 * threadPitch`, and
`endDiameter = diameter - 2 * chamfer`. The thread root diameter must remain
positive. Chamfer must be less than both half the diameter and half the length,
so flat end faces remain and the two end chamfers cannot meet.

The exported props/definition schemas are strict. `ThreadedRodModelPropsInput`
accepts unit strings and optional defaults; `ThreadedRodModelProps` resolves
millimeters and coarse pitch. `ThreadedRodModelDefinition` adds
`fn: "threadedrod"` and belongs to the public `modelDefinitionSchema` union.
