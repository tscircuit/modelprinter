# Honeycomb Panel (`honeycombpanel`)

Sandwich structural panel with flat outer skins and a hexagonal cellular core (roadmap #13, item 0560).

## Example Model String

```text
honeycombpanel_l200mm_w100mm_t10mm_skint0.5mm_hexaf6mm_corewall0.1mm
```

## Parameters

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `l<length>`, `length<length>` | `length` | `200 mm` | Panel length along X |
| `w<length>`, `width<length>` | `width` | `100 mm` | Panel width along Y |
| `t<length>`, `thickness<length>` | `thickness` | `10 mm` | Total sandwich thickness |
| `skint<length>` | `skinThickness` | `0.5 mm` | Each outer face sheet thickness |
| `hexaf<length>` | `hexAcrossFlats` | `6 mm` | Hexagonal cell across-flats spacing |
| `corewall<length>` | `coreWallThickness` | `0.1 mm` | Hexagonal foil/cell wall thickness |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Bottom skin center (`bottomZ = 0`, `topZ = thickness`).
