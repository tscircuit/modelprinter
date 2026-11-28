# `dinrail`

EN 60715 `TH35-7.5` symmetric top-hat DIN mounting rail with a 27 mm recessed base web and 4 mm outward mounting lips (roadmap item `0117`).

## Canonical Model String

```text
dinrail_en60715th35x7.5_w35mm_h7.5mm_l150mm_t1mm_basew27mm_lip4mm_tophat_unslotted
```

## Parameters

| Token | Property | Default | Description |
| --- | --- | --- | --- |
| `en60715th35x7.5` / `th35x7.5` | `en60715Th35x75` | `true` | EN 60715 TH35-7.5 standard profile flag |
| `w<len>` | `width` | `35` | Overall lip-to-lip rail width (mm) |
| `h<len>` | `height` | `7.5` | Top-hat profile height (mm) |
| `l<len>` | `length` | `150` | Rail cut length (mm) |
| `t<len>` | `sheetThickness` | `1` | Formed steel stock thickness (mm) |
| `basew<len>` | `baseWidth` | `27` | Recessed mounting web width (mm) |
| `lip<len>` | `lipWidth` | `4` | Outward equipment-clip lip width per side (mm) |
| `tophat` | `topHat` | `true` | Symmetric top-hat cross-section flag |
| `unslotted` / `slotted` | `unslotted` | `true` | Solid unperforated vs slotted web flag |

## Coordinate Frame & Datums

- **Origin `(0, 0, 0)`**: Centered across `width` and `length` on the rear mounting face (`bottomZ = 0`), with outward clip lips at `topZ = height`.
- **Validation**: Enforces `baseWidth + 2 * lipWidth === width` and stock thickness clearance while rejecting legacy `spec(...)` and `profile(...)` selectors.
