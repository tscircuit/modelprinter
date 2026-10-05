# Flexscreen connector pitch

Use a pin count after the model name and the usual `p` pitch token:

```ts
mp.string("flexscreen30_w16_h10_flex5_p0.5mm_sitsflat").json()
// { fn: "flexscreen", pinCount: 30, pitch: 0.5,
//   width: 16, height: 10, flexCableLength: 5, orientation: "sitsFlat" }
```

The connector-facing properties match jscad-electronics' `FPC` component:

| Model string token | Property | Meaning |
| --- | --- | --- |
| `flexscreen30` or `pincount30` | `pinCount` | Number of connector contacts |
| `p0.5mm` or `pitch0.5mm` | `pitch` | Contact center-to-center spacing |
| `pw0.3mm` or `padwidth0.3mm` | `padWidth` | Contact width |
| `pl1.25mm` or `padlength1.25mm` | `padLength` | Exposed contact length |
| `tail3mm` or `taillength3mm` | `tailLength` | Widened straight end before the taper |
| `taper2mm` or `taperlength2mm` | `taperLength` | Transition length from tail to narrow body |

For example, `flexscreen30_w16_h10_flex10_p0.5mm_pw0.3mm_pl1.25mm_tail3mm_taper2mm_sitsflat`
shares its count and contact dimensions with `fpc30_p0.5mm_pw0.3mm_pl1.25mm`.
Counts must be positive integers; pitch, width, tail length and taper length
must be positive lengths. Contact length can be zero to hide exposed contacts.

Display manufacturers use the term [FPC tail](https://www.crystalfontz.com/blog/glossary/fpc/)
for the flexible display connection. `tailLength` here specifically measures
the constant-width widened section from the connector tip to the start of
the taper. It is independent of the exposed contact and stiffener lengths.
The sum of tail and taper lengths cannot exceed the total `flex` length.
When omitted, these lengths retain the existing automatic sizing.
Contacts and stiffeners are clipped to fit the tail and cable length.

In jscad-electronics, pitch controls the spacing at the connector (the cable
start). If those contacts exceed the cable body width, the connector end
widens to contain the contact span plus both edge margins and tapers to
the body width toward the screen. Screen-end contacts fit the narrower body.
Omitting pitch preserves the existing automatically spaced contacts.

Existing `conductorCount`, `conductorPitch`, `conductorWidth`, and
`exposedContactLength` props and their long model-string tokens remain
supported as compatibility aliases. The FPC-style props take precedence
when both names are supplied.
