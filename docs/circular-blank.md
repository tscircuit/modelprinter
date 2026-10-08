# Circular machining blank

`circularblank` describes solid round machining stock with two planar faces and
a circular outside wall. It implements roadmap #13, item 0257:

```ts
mp.string("circularblank_d80mm_t10mm_rimr0mm").json()
// { fn: "circularblank", diameter: 80, thickness: 10, rimRadius: 0 }
```

Diameter and thickness are required; the default rim radius is zero, giving the
unworked, square rims in the roadmap example. This is a generic dimensional
contract, without a specified material, tolerance, hole, thread or machining
allowance. Geometry belongs in `tscircuit/jscad-electronics`.

| Property | String aliases | Meaning |
| --- | --- | --- |
| `diameter` | `d`, `diameter` | Overall XY diameter; finite and greater than zero |
| `thickness` | `t`, `thickness` | Overall Z height; finite and greater than zero |
| `rimRadius` | `rimr`, `rimradius` | Radius of both outside circular rim round-overs; defaults to 0 |

The diameter must also be large enough that halving it yields a representable
positive JavaScript number, preventing the radial bounds from collapsing to zero.

This contract interprets a positive rim radius as equal round-overs of the top
and bottom rims, preserving the overall diameter and thickness. The radius must
be nonnegative and strictly less than half both the diameter and thickness, so
both flat faces and a straight outside wall remain. For example,
`circularblank_d80mm_t10mm_rimr1mm` leaves flat faces 78 mm in diameter and a
straight sidewall 8 mm high. Zero leaves the sharp-edged circular cylinder.

The blank is centered at X=Y=0, with its bottom face at Z=0 and top at
Z=`thickness`. `getCircularBlankDimensions(props)` validates input and returns
the normalized dimensions, radius, flat-face diameter, straight-wall height and
bounding coordinates. The public API also exports
`circularBlankModelPropsSchema`, `circularBlankModelDefinitionSchema` and their
input/output types; the definition is included in `modelDefinitionSchema`.

Dimension strings accept plain decimals with `mm`, `cm`, `m`, `in`, `inch`,
`mil`, `ft` or `feet`; unitless values mean millimeters. Names and units are case
insensitive. All JSON dimensions are millimeters. Duplicate aliases, unknown
tokens or properties, missing dimensions, incomplete values, exponential string
notation and impossible rim radii are rejected.
