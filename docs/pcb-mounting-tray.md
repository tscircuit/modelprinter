# PCB mounting tray parameter contract

```text
pcbmountingtray_w100mm_d80mm_h12mm_wall2mm_bossod6mm_bossid3mm_bossh5mm_hp(88mm,68mm)_ears2
```

`pcbmountingtray` defines an open-top rectangular PCB carrier tray (`width`,
`depth`, `height`, `wallThickness`) with four cylindrical PCB standoff bosses on
a centered `holePattern = [pitchX, pitchY]` rectangle and two outward side
mounting ears on the `±X` walls.

## Local frame and defaults

- Tray bottom mounting plane lies at `Z=0`, interior floor lies at
  `Z=wallThickness` (`2 mm`), PCB mounting boss tops lie at
  `Z = wallThickness + bossHeight` (`7 mm`), and perimeter rim reaches
  `Z=height` (`12 mm`).
- Default tray body is `100 × 80 × 12 mm` (`96 × 76 mm` interior cavity) with
  `6 mm` OD / `3 mm` ID bosses on an `88 × 68 mm` grid and two outward side
  mounting ears (`earExtension = 2 * bossOuterDiameter = 12 mm` per side).

`getPcbMountingTrayDimensions` resolves interior cavity dimensions, four corner
boss centers, and outward ear mounting hole centers in millimeters. Geometry
generation belongs in `jscad-electronics`.
