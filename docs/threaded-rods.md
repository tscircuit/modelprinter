# Threaded rod

`threadedrod` defines a straight, fully threaded metric rod with flat end planes.
It produces dimensions and validated model definitions for mechanical layout.
Geometry belongs in jscad-electronics. The nominal 60-degree ISO metric external
thread profile has no manufacturing tolerances, thread runout, or end relief.

```ts
import { getThreadedRodDimensions, mp, threadedRodModelPropsSchema } from "@tscircuit/modelprinter"

mp.string("threadedrod_m6_l100mm_chamfer0.5mm").json()
// { fn: "threadedrod", metricSize: "M6", length: 100,
//   chamfer: 0.5, threadPitch: 1, leftHand: false }
mp.string("threadedrod_m6_l100mm_threadpitch0.5mm_lefthanded").json()
threadedRodModelPropsSchema.parse({ metricSize: "M6", length: "10cm", leftHand: true })
getThreadedRodDimensions({ metricSize: "M6", length: 100, chamfer: 0.5 })
```

| Property | Default | Token | Meaning |
| --- | --- | --- | --- |
| `metricSize` | Required | `m6` | Nominal major diameter; supported sizes below |
| `length` | Required | `l`, `length` | Overall length, including the end chamfers |
| `chamfer` | 0 mm | `chamfer` | Axial and radial setbacks of both 45-degree outside end chamfers |
| `threadPitch` | Coarse pitch for size | `threadpitch` | Positive axial pitch; explicitly set for fine threads |
| `leftHand` | `false` | `_lefthanded`; omit or use `_righthanded` for right-hand threads | Single-start thread handedness as a boolean |

Fully threaded construction and flat ends are fixed properties of this model.
They need no selectors or JSON properties; partial threads and other end shapes
are unsupported.

`threadedRodCoarsePitches` supplies the supported sizes and coarse pitch in mm:
M2: 0.4, M2.5: 0.45, M3: 0.5, M4: 0.7, M5: 0.8, M6: 1, M8: 1.25,
M10: 1.5, M12: 1.75, M16: 2, M20: 2.5. This selected table is not a tolerance
or standards-compliance specification. A metric token has a unitless nominal
size; unsupported sizes require a future extension to this contract.

Lengths accept finite numbers in millimeters or complete numeric strings with
optional `mm`, `cm`, `m`, `in`, `inch`, `mil`, `ft`, or `feet` units. All output
lengths are millimeters. Model-string tokens and flags are case-insensitive;
direct properties use the names shown above and `leftHand` accepts a boolean.
Flags are value-free. Unknown properties, malformed values, duplicate tokens,
and duplicate aliases are rejected.

The only option flags are `_lefthanded` and `_righthanded`. Repeated or conflicting
handedness flags are errors. `_righthanded` is omitted from `.params().string`,
and normalization is idempotent. Complete model strings are validated during
`.string()`. Parenthesized enum selectors and flags for fixed properties such as
`_fullthread` are unsupported.

A bare `threadedrod` name supports renderer dispatch through `.params().fn`;
`.json()` still requires metric size and length.

JSON and direct props use `leftHand: true` for left-handed threads and
`leftHand: false` for right-handed threads. The strict schemas reject unknown
properties, including `spec`, `thread`, `ends`, and `threadHand`.

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
