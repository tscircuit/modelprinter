# Lead screw

`leadscrew` is a generic, fully threaded TR8 lead screw. It supports the de-facto
TR8x2 (pitch 2 mm, lead 2 mm, one start) and TR8x8(P2) (pitch 2 mm, lead 8 mm,
four starts) designations. The included thread angle is 30 degrees.

```ts
mp.string("leadscrew_profile(iso2901)_tr8x8(p2)_l100mm").json()
mp.string("leadscrew_tr8x2_l100mm_hand(left)").json()
getLeadScrewDimensions({threadSize:"TR8x8(P2)",length:"10cm"})
```

This is a nominal visual/layout contract, with ISO 2901:2016 clause 6/Table 2
design-profile formulas and its P = 2 mm crest clearance ac = 0.25 mm. Source:
[ISO 2901:2016 primary preview](https://cdn.standards.iteh.ai/samples/68337/c87112d8e3dc487c95fd964d13101ca4/ISO-2901-2016.pdf).
The [ISO 2904:2020 basic dimension table](https://cdn.standards.iteh.ai/samples/78729/f0c949f3a1d442c59f222e2439c53a89/ISO-2904-2020.pdf)
lists diameter 8 with P = 1.5; this implementation's common TR8/P2 variants
are explicitly de-facto sizes. `profile(iso2901)` means the profile only:
it does not certify an ISO 2902 general-plan size or ISO 2903 tolerance class.
No manufacturer name, accuracy grade, tolerance, runout, end bearing journal,
root rounding, or manufacturing specification is implied.

| Property | Default | String token |
| --- | --- | --- |
| `threadSize` | required | `tr8x2` or `tr8x8(p2)` |
| `profile` | resolves to `iso2901:2016` | `profile(iso2901)`, `profile(iso2901:2016)` |
| `length` | required | `l`, `length` |
| `chamfer` | 0.25 mm | `chamfer` |
| `threadPitch` | 2 mm | `pitch`, `threadpitch` |
| `threadLead` | 2 or 8 mm from designation | `lead`, `threadlead` |
| `threadStarts` | 1 or 4 from designation | `starts` |
| `threadHand` | right | `hand(right)`, `threadhand(left)` |

Explicit pitch, lead and start count are assertions and must agree with the
designation. Lead equals pitch times starts. Lengths are finite numbers in mm
or complete numeric strings with optional mm/cm/m/in/inch/mil/ft/feet units.
Output is mm. String tokens are case-insensitive. Direct property enums use
the documented case. Unknown properties, duplicate aliases, malformed tokens
and conflicting thread assertions fail in both props/definition schemas.

Major diameter d = 8; pitch diameter d2 = d - P/2 = 7; external minor diameter
d3 = d - P - 2ac = 5.5. The external design profile uses sharp corners, 30 degree
flanks and flat crest/root truncations. At phase distance u in [0, P/2],
radius is clamp(d2/2 + (P/4 - u)/tan(15 degrees), d3/2, d/2).

Axis is Z; end planes are Z = 0 and Z = length. The optional 45 degree outer
chamfers remain inside those planes; chamfer must be below both 4 mm and half
the length. Phase 0 gives a crest at +X, Z = 0. A right-hand crest advances
+X toward +Y as Z increases. Phase is z/P minus starts * theta/(2 pi) for
right-hand, with the angular sign reversed for left-hand. Every individual
start advances by the lead over a full revolution; neighboring starts are
separated by one pitch axially and by 2 pi/starts angularly.

Exports: strict `leadScrewModelPropsSchema`, `leadScrewModelDefinitionSchema`,
`LeadScrewModelPropsInput`, `LeadScrewModelProps`, `LeadScrewModelDefinition`,
and `getLeadScrewDimensions`. Registration and the public union are discovered
from this family's `register.ts`.
