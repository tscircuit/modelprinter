# Generic linear bearing block

`linearbearingblock_bore8mm_bearingod15mm_w34mm_l24mm_h24mm_mount(clearance)_hole4.5mm_pitchx24mm_pitchy16mm`
is a chosen generic housing and nominal recirculating cartridge assembly.
It is not an SCS envelope or a manufacturer product. Defaults are shaft bore
8 mm, cartridge outside diameter 15 mm, body width X=34 mm, length Y=24 mm,
height Z=24 mm, four 4.5 mm clearance holes on 24 × 16 mm center pitches,
and `mount: "clearance"`. The cartridge's overall length equals body length;
its two end retainers are flush with the Y faces. No threads or tolerance
fits are implied, and there are no omitted threaded fasteners.

The housing's mounting face is Z=0; its top is Z=height. X and Y are centered.
Shaft axis is Y at X=0, Z=height/2 (12 mm by default), from Y=-length/2 to
Y=+length/2. Four vertical through holes have axes Z at X=±mountPitchX/2,
Y=±mountPitchY/2. Defaults leave 4.5 mm housing above/below the cartridge,
2.25 mm between each mounting hole and the cartridge, and 1.75 mm between
mounting-hole rims and Y end faces. The circular receptacle and cartridge
are nominal mating surfaces; they do not specify interference or retention.

Tokens are `bore`/`id`/`borediameter`, `bearingod`/`bearingouterdiameter`,
`w`/`width`, `l`/`length`, `h`/`height`, `hole`/`holediameter`, `pitchx`,
`pitchy`, and `mount(clearance)`. All dimensions are optional with the defaults
above. Positive dimensions, positive housing walls, four separate holes,
positive hole-to-cartridge and hole-to-edge clearances, and positive rolling
track length are required. Units are mm by default, with complete
mm/cm/m/in/inch/mil/ft/feet strings accepted. Duplicate aliases, incomplete
lengths, unknown tokens/options and extra direct-schema fields are rejected.

`getLinearBearingBlockDimensions` owns all housing datums and nominal
cartridge balls, loaded/return grooves, polymer separators, return-row retaining floors and end retainers.
Six loaded rows and six offset return rows illustrate recirculation without
claiming standard internal geometry, load ratings, preload or supplier fits.
This contract is independent of the separate linearballbearing family.
