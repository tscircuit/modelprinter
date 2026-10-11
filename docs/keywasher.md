# KeyWasher

```text
keywasher_id10mm_od20mm_h1mm_tabw3mm_tabl2mm_tabs1_inward
```

Custom annular key washer centered on XY, bottom Z=0 and top Z=thickness. One rectangular tab on +X projects inward from the nominal circular bore to X=innerDiameter/2-tabLength. Tab width is along Y and the tab root overlaps the annular body. tabLength is measured radially at the tab centerline. No supplier standard is claimed.

Lengths accept complete decimals with optional units and normalize to millimeters. The schema rejects unknown fields, duplicate aliases, malformed tokens and dimensions that eliminate required material. `getKeyWasherDimensions` exposes the resolved dimensions and installation datums. Legacy roadmap selectors map to value-free flags; there are no enum selectors in the resolved contract.
