# T-slot gusset

```text
tslotgusset_w40mm_h40mm_t4mm_shape(righttriangle)_slots2_slot(5mm,12mm)_centers(12mm,28mm)
```

This custom right triangular flat corner plate has one capsule-shaped fixing
slot parallel to each perpendicular edge. No supplier series is implied.
The shape and two-slot layout are fixed identities; other shapes or slot counts
are rejected. Unequal triangle width and height are supported.

| Token | JSON property | Default |
| --- | --- | --- |
| `w`, `width` | `width` | 40 mm |
| `h`, `height` | `height` | 40 mm |
| `t`, `thickness` | `thickness` | 4 mm |
| `shape(...)` | `shape` | `righttriangle` |
| `slots`, `slotcount` | `slotCount` | 2 |
| `slot(width,length)` | `slot` | [5 mm,12 mm] |
| `centers(xDistance,yDistance)` | `centers` | [12 mm,28 mm] |
| `edgemargin` | `edgeMargin` | 1 mm |

The local mounting datum is the right-angle vertex at (X,Y,Z)=(0,0,0).
The triangle vertices on the mounting face are (0,0), (width,0) and (0,height).
Material extends from Z=0 to +thickness; both faces are flat. All plate edges
and corners are sharp, with zero fillets or chamfers. There are no ribs,
countersinks or additional holes.

`centers` specifies two along-edge distances, **not one XY point**. Let the slot
width be S, overall length be L, and transverse inset I=S/2+edgeMargin:

- The first slot center is (centers[0],I,0). Its long axis follows +X (0 degrees).
- The second slot center is (I,centers[1],0). Its long axis follows +Y (90 degrees).

Thus the example resolves to centers (12,3.5,0) and (3.5,28,0), with a 1 mm
ligament beside each parallel outer edge. This fixed margin resolves the
omitted transverse location. The two ends of each slot are semicircles of
radius S/2, separated by a straight segment of length L-S. L includes both
rounded ends and must be at least S; L=S is a round opening. Both slots cut
through the entire plate in +Z. `getTSlotGussetMountingSlots` returns centers,
orientation in degrees counterclockwise from +X, width, length, depth and
direction for the mounting contract.

Validation uses the full capsule envelope against all three triangle edges,
including the sloped hypotenuse, and the distance between the two slot center
segments to prevent overlap or contact. Every slot must leave strictly positive
material to every outside edge and the other slot.

Lengths normalize to mm from finite numbers or complete strings with optional
`mm`, `cm`, `m`, `in`, `inch`, `mil`, `ft` or `feet`. Counts are unitless integers.
Tuple arguments require exactly two lengths; whitespace around those arguments
is accepted. Direct props/definition schemas are strict. Unknown tokens,
duplicate parameters (including aliases), malformed tuples and unsupported
layouts fail. Geometry generation belongs in jscad-electronics.
