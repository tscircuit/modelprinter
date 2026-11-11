# Duct end cap

`ductendcap` defines a circular flat closure with a concentric attachment skirt.

```ts
mp.string("ductendcap_od150mm_depth25mm_wall0.8mm_skirtid148.4mm_flat").json()
```

`depth` is the total axial height. `wall` is the thickness of both the flat
face and the cylindrical skirt. `skirtid` defaults to the outside diameter
minus twice the wall thickness. An explicit `skirtid` must agree with that
dimension within floating-point roundoff. `flat` defaults to true and can
also be written as `face(flat)`.

`getDuctEndCapDimensions` reports a 0.8 mm face thickness and 24.2 mm usable
skirt length for this example. Both the opening and skirt length must remain
positive.
