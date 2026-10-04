# Ball bearings

`ballbearing` describes a radial ball bearing; `thrustballbearing` describes an
axial ball bearing assembly. These parameter contracts implement proposals 0015
and 0079 in [the mechanical components roadmap](https://github.com/tscircuit/modelprinter/issues/13).

```ts
import { mp } from "@tscircuit/modelprinter"

mp.string("ballbearing_id8mm_od22mm_w7mm").json()
// { fn: "ballbearing", innerDiameter: 8, outerDiameter: 22, width: 7 }

mp.string("thrustballbearing_id10mm_od24mm_h9mm").json()
// { fn: "thrustballbearing", innerDiameter: 10, outerDiameter: 24, height: 9 }
```

| Property | String tokens | Radial default | Thrust default |
| --- | --- | --- | --- |
| `innerDiameter` | `id`, `innerdiameter` | 8 mm | 10 mm |
| `outerDiameter` | `od`, `outerdiameter` | 22 mm | 24 mm |
| `width` | `w`, `width` | 7 mm | Not accepted |
| `height` | `h`, `height` | Not accepted | 9 mm |

The axial dimension is the overall assembled size: `width` for the radial
bearing and `height` for the thrust bearing, including its washers and cage.
Defaults come from the roadmap examples. They describe overall dimensions;
they are not a catalog of interchangeable standard bearing designations.

All dimensions accept numbers in millimeters or unit-bearing strings supported
by `@tscircuit/mm`, including `mm`, `cm`, `m`, and `in`. Parsed output is numeric
millimeters. Model names and token names are case-insensitive; omitted
dimensions receive defaults. For example, `ballbearing_id0.5in_od2in_w0.25in`
returns diameters 12.7 and 50.8, and width 6.35.

Lengths must be finite and greater than zero. Inner diameter must be strictly
smaller than outer diameter after conversion and default application. Unknown
properties, tokens without values, repeated dimensions (including aliases),
inline root values, and the other family's axial token are rejected.

`ballBearingModelPropsSchema` and `thrustBallBearingModelPropsSchema` validate
props without `fn`; their `ModelDefinitionSchema` counterparts require the
appropriate `fn`. Both definitions are included in `modelDefinitionSchema`.
The package exports `ballBearingDefaults`, `thrustBallBearingDefaults`, and
the corresponding `BallBearingModelPropsInput`, `BallBearingModelProps`,
`BallBearingModelDefinition`, and `ThrustBallBearing...` types.

This package owns the dimensional contract. Internal race profiles, balls,
cages, meshes, and visual snapshots belong in `tscircuit/jscad-electronics`.
Overall dimensions do not determine manufacturing tolerances, internal ball
counts, or load ratings.
