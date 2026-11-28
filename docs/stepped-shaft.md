# Stepped Shaft (`steppedshaft`)

Round shaft with symmetric reduced end journals, locating shoulders, transition fillets, and end chamfers (roadmap #13, item 0305).

## Example Model String

```text
steppedshaft_d20mm_endd12mm_l150mm_endl25mm_shoulderfillet1mm_endchamfer1mm
```

## Parameters

| Token | Property | Default | Notes |
| --- | --- | --- | --- |
| `d<length>`, `od<length>` | `diameter` | `20 mm` | Central main shaft diameter |
| `endd<length>` | `endDiameter` | `12 mm` | Reduced bearing journal diameter at both ends |
| `l<length>`, `length<length>` | `length` | `150 mm` | Overall shaft length |
| `endl<length>` | `endLength` | `25 mm` | Length of each reduced end journal |
| `shoulderfillet<length>` | `shoulderFillet` | `1 mm` | Fillet radius at each locating shoulder |
| `endchamfer<length>` | `endChamfer` | `1 mm` | 45-degree chamfer at both journal tips |

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Lower journal end face center (`bottomZ = 0`, `topZ = length`).
