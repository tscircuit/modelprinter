# U.FL receptacle

`ufl` describes an unmated surface mount U.FL receptacle. The body and coaxial
axis are centered at X=0, Y=0; Z=0 is the board surface, and mating is along +Z.
Ground terminals lie on +/-Y, and the signal terminal lies on -X.
`ufl3` selects the same three-terminal model; other pin counts are invalid.

The nominal envelope follows the Hirose U.FL series catalog, receptacle drawing
on page 3: 2.6 mm square base, 0.35 mm base height, 2 mm shell outer diameter,
1.25 mm overall unmated height, and 3.0/3.1 mm terminal spans. The socket bore,
dielectric, and center pin are simplified visual geometry; this contract does
not specify mating tolerances, a plug, or RF performance.

Source: [Hirose U.FL series catalog](https://www.hirose.com/en/product/document?clcode=&documentid=ed_U.FL_CAT&documenttype=Catalog&lang=en&productname=&series=U.FL),
also available as [the Hirose catalog distributed by LCSC](https://atta.szlcsc.com/upload/public/pdf/source/20260116/2407FA611152E2F7D3D59FECA9EB337E.pdf).

Pad controls match the compact footprint tokens. `p` is the ground pad center
spacing (default 3 mm), `pw`/`ph` are ground pad width/height (2.2/1.1 mm),
`signalw`/`signalh` are signal pad width/height (1.5/1.1 mm), and `signalx` is
the signal pad X center (-1.25 mm). Changing pad controls adjusts solder
terminal placement and size while retaining the nominal receptacle body.
