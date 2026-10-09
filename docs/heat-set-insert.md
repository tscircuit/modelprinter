# heatsetinsert parameter contract

```ts
mp.string("heatsetinsert_m3_od4.6mm_l5mm_knurldepth0.2mm_knurlp0.6mm_knurlteeth24_diamondknurl").json()
```

This is a deterministic nominal visualization of a full-length, unflanged heat-set insert. It has a through internal metric thread and an external crossed diamond knurl. It does not identify a manufacturer's part, prescribe a plastic hole size, simulate insertion or certify a fastening standard. M3/M4/M5/M6 coarse threads are supported with pitch 0.5/0.7/0.8/1 mm.

`outerDiameter` is the maximum knurl crest diameter. `knurlDepth` is a radial setback, so the minimum root diameter is outerDiameter-2*knurlDepth. `knurlPitch` is the axial repeat distance, and `knurlTeeth` is the integer number of circumferential repeats (3–96). The thread major diameter must remain more than 0.000001 mm inside the root outer diameter, measured diametrally. The length divided by the smaller of thread pitch and knurl pitch must not exceed 1000. The renderer applies an additional vertex allocation limit.

For theta measured counterclockwise from +X, let u=knurlTeeth*theta/(2*pi), v=Z/knurlPitch and T(q)=2*distance(q,nearest integer). The radial outer profile is outerDiameter/2-knurlDepth*max(T(u+v),T(u-v)). This produces a field of diamond pyramids with crossed helical grooves and no implicit straight knurl bands. Crest phase starts at theta=0,Z=0; after a half axial pitch the crest row shifts half a tooth. Both ends are cut at their exact planes without a separate flange, end bands, or chamfers.

The mounting end plane is Z=0 and the opposite end Z=length. Both annular end faces connect the knurl to the through thread. The internal nominal 60-degree ISO-style thread uses H=sqrt(3)*P/2, minor diameter d-5H/4 and pitch diameter d-3H/4. Each pitch has a minor-radius flat P/4 and a major-radius groove flat P/8; straight flanks join them. The minor-radius crest center crosses +X at Z=0, advancing counterclockwise as Z increases for right-hand threads. `lefthanded` reverses only the internal thread, preserving the two-direction knurl. `nothreads` leaves a smooth bore at the internal minor diameter. Thread tolerance allowances, root rounding, mouths and runout are omitted.

`diamondknurl` defaults true and normalizes to the true boolean `diamondKnurl`. `m`/`metricsize(mN)`, `od`/`outerdiameter`, `l`/`length` and `knurlp`/`knurlpitch` are aliases. `threads`/`nothreads` and `lefthanded`/`righthanded` are mutually exclusive value-free flags. All lengths accept complete decimals with mm, cm, m, in or inch and normalize to millimeters. `knurlteeth` requires a unitless integer. Unknown tokens/properties, duplicate aliases/flags, flags with values, exponent notation, junk and invalid walls are rejected. Derived diameter/pitch/root fields may be supplied for normalized schema roundtrips but must agree with the metric size and envelope.
