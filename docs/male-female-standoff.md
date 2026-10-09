# Male-female hex standoff

`malefemalestandoff_m3_af5.5mm_l10mm_studl5mm_femaledepth6mm_hex`

This generic, single-start metric standoff uses explicit body and mounting dimensions. It does not claim a manufacturer envelope, fit class or manufacturing tolerance. `m` selects M2, M2.5, M3, M4, M5, M6, M8, M10 or M12. ISO metric coarse pitch defaults are respectively 0.4, 0.45, 0.5, 0.7, 0.8, 1, 1.25, 1.5 and 1.75 mm; `threadpitch` allows an explicit visual pitch leaving positive thread root diameters. Both male and female threads share pitch and handedness. `lefthanded` or `righthanded` selects handedness; `threads` or `nothreads` selects visible thread relief. Repeated and conflicting flags are rejected. The default is a right-handed hex body with visible threads; `_hex` is optional.

`af`/`acrossflats`, `l`/`length`, `studl`/`studlength` and `femaledepth` are required positive dimensions and accept millimeters or the standard model-length units. `l` measures the hex body only. Its lower mounting shoulder is Z=0, its upper mounting face is Z=length, and the stud terminates at Z=-studLength. The top female socket has a flat blind floor at Z=length-femaleDepth, strictly above Z=0. These are independent dimensions; length never includes the male extension. In the example the complete part spans Z=-5..10, and the female socket spans Z=4..10.

Basic 60-degree metric profile proportions define external root diameter D-(17√3/24)P and internal minor diameter D-(5√3/8)P. These are untoleranced visualization profiles, without drill-point, runout, root rounding or thread-start lead-in claims.

`bodychamfer`, `studchamfer` and `mouthchamfer` accept nonnegative radial setbacks. Each defaults to the minimum of P/4, (AF-D)/8, body length/8, stud length/8 and female depth/8. Body chamfers inset each hex flat by the setback over an equal axial distance at both body ends. The stud's 45-degree conical tip has a circular terminal diameter of external root diameter minus twice its setback; its cone reaches nominal diameter after the thread depth plus setback. The mouth's 45-degree cone opens to D plus twice its setback. Validation preserves a flat stud tip, distinct body chamfers, a straight blind socket below the mouth and positive material around both mounting features. Set any chamfer to zero explicitly to suppress its additional radial setback.

The renderer belongs in jscad-electronics. No geometry is stored in this package.
