# Stock plate

Implements the parameter contract for roadmap issue #13, item 0152:

```ts
mp.string("stockplate_l100mm_w80mm_t12mm_edger0mm").json()
// { fn: "stockplate", length: 100, width: 80, thickness: 12, edgeRadius: 0 }
```

This is custom rectangular stock for machining or mounting structures, with
no holes, threads, bends, chamfers, coatings, or implied material. It claims no
catalog or dimensional standard. All three envelope dimensions are required;
the only default is a zero edge radius (sharp edges).

| Tokens | Property | Contract |
| --- | --- | --- |
| `l`, `length` | `length` | Positive overall X dimension |
| `w`, `width` | `width` | Positive overall Y dimension |
| `t`, `thickness` | `thickness` | Positive overall Z dimension |
| `edger`, `edgeradius` | `edgeRadius` | Nonnegative uniform outside-edge round-over; defaults to zero |

Numbers without a unit and numeric schema inputs are millimeters. String
lengths accept `mm`, `cm`, `m`, `in`, `inch`, `mil`, `ft`, or `feet`, ignoring
case; schemas normalize all lengths to millimeters. Tokens are also case
insensitive. Scientific notation, unknown units, missing dimensions, trailing
junk, duplicate properties (including aliases), and unknown tokens are rejected.

The nominal envelope is centered at X=0 and Y=0, with the bottom face on Z=0
and the top face on Z=`thickness`. Positive `edgeRadius` describes the same
round-over on all twelve outside edges, with spherical corner transitions and
the overall envelope preserved. It must be strictly less than half of every
envelope dimension so each of the six faces retains a positive flat portion.
`edger0mm` produces the roadmap's square, unformed edges.

Public exports include `stockPlateModelPropsSchema`,
`stockPlateModelDefinitionSchema`, their input/output types, and
`getStockPlateDimensions`. The helper validates the props and returns the
normalized envelope and its datum-relative bounds. The generated model
registry and `modelDefinitionSchema` include the model automatically.

This package defines parameters only. Geometry generation and visual
snapshots belong in `tscircuit/jscad-electronics`.
