# Lead screw nut

`leadscrewnut` is a generic mating nut for the de-facto TR8x2 or TR8x8(P2)
lead screw. The thread designation determines pitch/lead/start count; it does
not determine the body, flange or mounting-hole dimensions.

```ts
mp.string("leadscrewnut_tr8x8(p2)_bodyod12mm_l15mm_flangeod22mm_flanget3mm_holes4_hole3.5mm_bcd16mm").json()
mp.string("leadscrewnut_tr8x2_style(cylindrical)_bodyod12mm_l15mm").json()
getLeadScrewNutDimensions({threadSize:"TR8x8(P2)"})
```

The 30 degree profile and P = 2 mm/ac = 0.25 mm design clearance follow
[ISO 2901:2016 clause 6/Table 2](https://cdn.standards.iteh.ai/samples/68337/c87112d8e3dc487c95fd964d13101ca4/ISO-2901-2016.pdf).
Nominal female D1 = d - P = 6 mm, D2 = d - P/2 = 7 mm, D4 = d + 2ac = 8.5 mm;
male d3 = 5.5 mm and d = 8 mm leave 0.25 mm radial crest/root clearance.
The [ISO 2904:2020 table](https://cdn.standards.iteh.ai/samples/78729/f0c949f3a1d442c59f222e2439c53a89/ISO-2904-2020.pdf)
lists d = 8 mm / P = 1.5 mm, so the supported d = 8 mm / P = 2 mm sizes are de-facto,
with ISO 2901 profiles only. No ISO 2902 size-table, ISO 2903 tolerance,
anti-backlash preload, material or manufacturer's mounting-pattern claim.

Thread properties/tokens are identical to `leadscrew`: required
`threadSize` (`TR8x2` or `TR8x8(P2)`), profile defaults
`iso2901:2016`; threadPitch 2 mm; threadLead 2 or 8 mm; threadStarts 1 or 4;
threadHand right. Explicit `pitch`/`threadpitch`, `lead`/`threadlead`
and `starts` must match the designation. Use `hand(left)` or
`threadhand(left)` for the opposite hand.

| Property | Default | Token | Meaning |
| --- | --- | --- | --- |
| `style` | flanged | `style(flanged)`, `style(cylindrical)` | Generic mounting envelope |
| `bodyDiameter` | 12 mm | `bodyod`, `bodydiameter` | Cylindrical body outside diameter |
| `length` | 15 mm | `l`, `length` | Overall distance between end planes |
| `radialClearance` | 0.05 mm | `clearance` | Additional radial layout clearance on all female thread radii |
| `boreChamfer` | 1.5 mm | `borechamfer` | 45 degree lead-in depth/radial increase measured from the minor bore |
| `flangeDiameter` | 22 mm flanged; 0 cylindrical | `flangeod`, `flangediameter` | Custom flange diameter |
| `flangeThickness` | 3 mm flanged; 0 cylindrical | `flanget`, `flangethickness` | Flange thickness within overall length |
| `mountHoleCount` | 4 flanged; 0 cylindrical | `holes` | Four axial through-flange holes or none |
| `mountHoleDiameter` | 3.5 mm with holes; 0 without | `hole`, `holediameter` | Through-hole diameter |
| `mountHoleCircleDiameter` | 16 mm with holes; 0 without | `bcd` | Bolt-circle diameter |

The extra clearance is a custom rendering/layout allowance, not a tolerance
class. Defaults give bore minor 6.1 mm, pitch 7.1 mm, root 8.6 mm and mouth 9.1 mm.
The female radial profile is clamp(3.5 + (0.5 - u)/tan(15 degrees), 3, 4.25)
plus radialClearance, at the same phase as the mating screw. Thus root and
crest clearance are preserved; female bore is not a copy of the male surface.
No manufacturing root fillets are rendered.

Nut axis is Z; flange underside/mounting plane is Z = 0, shoulder is
Z = flangeThickness, and top is Z = length. For a cylindrical nut, bottom is Z = 0.
Holes are at +X, +Y, -X, -Y and extend only through the flange. The helix phase/hand
matches `leadscrew`, with lead = starts * pitch.

Body must leave positive wall outside both the thread root and bore mouth.
Bore chamfers must be zero or at least the 1.25 mm nominal thread depth and
less than half the length. Flange must exceed body diameter, and have positive
thickness below overall length. Mounting holes must leave positive ligaments
to the body, rim and each other. Cylindrical style forbids flange/holes;
zero holes requires zero hole/bolt-circle diameters. All dimensions normalize
to mm using finite numbers or complete numeric unit strings, as in leadscrew.
Both schemas reject unknown properties, duplicate aliases and conflicts.

Exports: `leadScrewNutModelPropsSchema`, `leadScrewNutModelDefinitionSchema`,
`LeadScrewNutModelPropsInput`, `LeadScrewNutModelProps`,
`LeadScrewNutModelDefinition`, and `getLeadScrewNutDimensions`.
