# Stepped Die-Contact Heat Spreader Plate (`heatspreader`)

Square thermal spreader plate with a centered raised contact boss and four countersunk corner mounting holes.

## Example Model String

```text
heatspreader_w50mm_l50mm_t3mm_boss(20mm,20mm,2mm)_holes4_hole3mm_countersink6mm_hp(40mm,40mm)
```

## Local Coordinate Datum

- **Origin `(0, 0, 0)`**: Flat rear cold-plate contact face center (`bottomZ = 0`, `topZ = thickness + bossHeight`).
