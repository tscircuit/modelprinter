# Adhesive-mount electrical heatsink

`adhesivemountelectricalheatsink_w20mm_l25mm_h12mm_base2mm_fin1mm_fins6`

A rectangular plate-fin heatsink body for adhesive mounting to electronic
components, with a flat bonding face at Z=0.
The base is centered on X/Y. Width runs along X, length along Y, and total height
along +Z. Fins run the complete Y length; their tops are at the total height.
The first and last fins are flush with the X edges. Intermediate fins have equal
spacing. There are no screw holes or clips. The adhesive/tape layer is a separate
assembly part and is excluded from the body dimensions and volume. Supplier fit,
fillets, thermal performance and electrical insulation are not specified.
Geometry and snapshots belong to jscad-electronics.

| Token | Public property | Default |
| --- | --- | --- |
| w | width | 20 mm |
| l | length | 20 mm |
| h | height | 10 mm |
| base | baseThickness | 2 mm |
| fin | finThickness | 1 mm |
| fins | finCount | 6 |

Lengths accept the shared millimeter/centimeter/meter/inch/mil/foot units and
normalize to millimeters. Fin count is a unitless integer from 2 through 128.
Height must exceed the base thickness; total fin thickness must be less than
width so that every gap is positive. Unknown/repeated tokens, nonfinite lengths
and unknown schema properties are errors. Case-insensitive strings are accepted.

`adhesiveMountElectricalHeatsinkModelPropsSchema`, `adhesiveMountElectricalHeatsinkModelDefinitionSchema` and their
input/output types form the public contract. `getAdhesiveMountElectricalHeatsinkDimensions`
returns fin pitch `(width - finThickness) / (finCount - 1)`, clear gap, fin height,
base datums and nominal solid volume. Dimensions do not predict cooling capacity.
