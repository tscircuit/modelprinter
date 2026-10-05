# Flexscreen connector pitch

Use a pin count after the model name and the usual `p` pitch token:

```ts
mp.string("flexscreen30_w16_h10_flex5_p0.5mm_sitsflat").json()
// { fn: "flexscreen", conductorCount: 30, conductorPitch: 0.5,
//   width: 16, height: 10, flexCableLength: 5, orientation: "sitsFlat" }
```

`p` and `pitch` are aliases for `conductorpitch`; all accept the same
unit-bearing lengths. `flexscreen30` and `pincount30` set `conductorCount`,
as do the existing `conductors30` and `conductorcount30` tokens.
Counts must be positive integers and pitches must be positive lengths.

In jscad-electronics, pitch controls the spacing at the connector (the cable
start). If those contacts exceed the cable body width, the connector end
widens to contain the contact span plus both edge margins and tapers to
the body width toward the screen. Screen-end contacts fit the narrower body.
Omitting pitch preserves the existing automatically spaced contacts.
