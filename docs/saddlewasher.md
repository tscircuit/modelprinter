# Saddle washer

`saddlewasher` defines a round washer with a flat upper face and a concave
cylindrical seat on the underside.

```ts
mp.string("saddlewasher_id6.4mm_od18mm_h8mm_radius12mm").json()
```

`h` is the total height from the low edges of the seat to the flat top.
`radius` is the radius of the cylindrical underside. It must be at least
half the outside diameter so that the seat spans the entire washer.

The flags `custom`, `cylindricalseat`, and `flattop` default to true.
The roadmap spellings `spec(custom)`, `seat(cylindrical)`, and `top(flat)`
are also accepted.

`getSaddleWasherDimensions` reports the cylindrical seat depth and the
minimum remaining thickness. The example has a seat depth of approximately
4.063 mm and a minimum thickness of approximately 3.937 mm. The seat must
leave positive material below the flat face beyond floating-point roundoff.
