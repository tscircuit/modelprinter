import { expect, test } from "bun:test"
import { mp, keyWasherModelPropsSchema } from "../src"
test("keywasher unit and token case normalization preserves dimensions", () => {
  expect(
    keyWasherModelPropsSchema.parse({
      innerDiameter: "1.0cm",
      outerDiameter: "2.0cm",
      thickness: "0.1cm",
      tabWidth: "0.3cm",
      tabLength: "0.2cm",
      tabCount: 1,
      inwardTab: true,
      custom: true,
    }),
  ).toEqual({
    innerDiameter: 10,
    outerDiameter: 20,
    thickness: 1,
    tabWidth: 3,
    tabLength: 2,
    tabCount: 1,
    inwardTab: true,
    custom: true,
  })
  expect(
    mp
      .string("KEYWASHER_ID10MM_OD20MM_H1MM_TABW3MM_TABL2MM_TABS1_INWARD")
      .json(),
  ).toEqual(
    mp
      .string("keywasher_id10mm_od20mm_h1mm_tabw3mm_tabl2mm_tabs1_inward")
      .json(),
  )
})
