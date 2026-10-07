# Generic linear carriage

```text
linearcarriage_w27mm_l45mm_h13mm_railw12mm_railh8mm_baseh2mm_neckw8mm_neckh2mm_clearance0.15mm_holes4_hole3mm_holex20mm_holey20mm_holedepth4mm
```

This configurable carriage is a solid mounting envelope with a matching waisted clearance channel, not a recirculating bearing specification. The chosen 27 × 45 mm example and 13 mm assembled height suit the illustrative 12 × 8 mm rail profile. They do not claim manufacturer dimensions, ball contacts, friction, accuracy, load capacity, lubrication details or cross-vendor interchangeability. All mounting holes are nominal smooth blind cylinders; threads and manufacturing fits are not simulated.

X is transverse, Y is travel, and both are centered on the carriage. Z=0 is the virtual rail-bed mounting datum, shared with `linearrail`; it is not the carriage's physical bottom. Material begins at `railBaseHeight + clearance` and ends at `height`. Thus the default body spans X=±13.5, Y=±22.5 and Z=2.15..13 mm. Place it on a 100 mm rail at Y=50 with no Z translation.

| Token (long alias) | Property | Default |
| --- | --- | --- |
| w (width), l (length), h (height) | width, length, height | 27, 45, 13 mm |
| railw (railwidth), railh (railheight) | railWidth, railHeight | 12, 8 mm |
| baseh (railbaseheight) | railBaseHeight | 2 mm |
| neckw (railneckwidth), neckh (railneckheight) | railNeckWidth, railNeckHeight | 8, 2 mm |
| clearance | clearance | 0.15 mm |
| holes (holecount) | holeCount | 4 |
| hole (holediameter) | holeDiameter | 3 mm |
| holex (holepitchx), holey (holepitchy) | holePitchX, holePitchY | 20, 20 mm |
| holedepth | holeDepth | 4 mm |

The channel runs through both Y ends. Its bottom opening is `railNeckWidth + 2 * clearance` wide, widening below the rail head at Z=`railBaseHeight + railNeckHeight - clearance` to `railWidth + 2 * clearance`. The chamber ceiling is Z=`railHeight + clearance`. This is a rectangular clearance envelope of the explicit rail profile; a top-chamfered rail fits within it. Positive shoulders below the head retain the carriage laterally; positive side walls and roof remain. These dimensions must match the mating rail's entire nominal cross-section.

Four holes enter the top face toward -Z at X=±`holePitchX/2` and Y=±`holePitchY/2`, each to `holeDepth`. The example hole centers are (±10,±10,13), and their flat floors are at Z=9. Every blind hole must retain material above the channel ceiling; this conservative rule also applies to holes outside its transverse span. Holes must remain separate and strictly within the body's outside edges. Other counts/layouts are rejected.

`getLinearCarriageDimensions` resolves the bottom, channel widths/shoulder/ceiling and roof thickness; `getLinearCarriageMountingHoles` returns face centers, diameters, depths and directions. Complete finite length strings normalize to mm using mm, cm, m, in, inch, mil, ft or feet. Direct schemas are strict; unknown tokens/keys, repeated aliases, invalid counts and incompatible walls/clearance/depths fail. Geometry belongs in jscad-electronics.
