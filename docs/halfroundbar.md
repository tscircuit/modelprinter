# Half-round bar

```text
halfroundbar_d20mm_l100mm_diametral_edger0mm
```

Solid stock with a semicircular cross section. The nominal circle is centered
at the XY origin. The flat face lies at Y=0, the arc lies in +Y, and the flat
end planes are Z=0 and Z=length.

| Property | Tokens | Meaning |
| --- | --- | --- |
| `diameter` | `d`, `diameter` | Nominal full circle diameter, required and positive |
| `length` | `l`, `length` | Axial length, required and positive |
| `diametral` | `diametral` | Value-free cut flag, defaults to true |
| `edgeRadius` | `edger`, `edgeradius` | Equal fillets at the two longitudinal flat-to-arc edges, defaults to zero |

Lengths normalize to millimeters. Complete decimal lengths accept `mm`, `cm`,
`m`, `in`, `inch`, `mil`, `ft` and `feet`, or no unit for millimeters.
Token order and letter case are unrestricted. Unknown tokens, repeated
properties, valued flags and the provisional `cut(diametral)` selector fail.

With nominal radius R and fillet radius r, the fillet centers are (±x,r),
where `x = sqrt(R * (R - 2r))`. The condition 0 <= r < R/2 preserves a flat
face of width 2x. The actual rounded profile width is 2(x+r), and its height
is R. For diameter 20 mm and r=1.8 mm, the flat face is 16 mm wide and the
profile envelope is 19.6 mm wide and 10 mm high.

`getHalfRoundBarDimensions` returns normalized props, radius, flat and
profile widths, height, size, actual bounds and end datums. Geometry
generation belongs in `jscad-electronics`.

Roadmap item [0558](https://github.com/tscircuit/modelprinter/issues/13#issuecomment-5977316175).
