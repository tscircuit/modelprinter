import { expect, test } from "bun:test"
import { mp, keyWasherModelPropsSchema, getKeyWasherDimensions } from "../src"
test("keywasher complete strings and public dimensions agree", () => {
  const props = {
    innerDiameter: 10,
    outerDiameter: 20,
    thickness: 1,
    tabWidth: 3,
    tabLength: 2,
    tabCount: 1,
    inwardTab: true,
    custom: true,
  } as const
  expect(
    mp
      .string("keywasher_id10mm_od20mm_h1mm_tabw3mm_tabl2mm_tabs1_inward")
      .json(),
  ).toEqual({ fn: "keywasher", ...props })
  expect(
    mp
      .string(
        "keywasher_spec(custom)_id10mm_od20mm_h1mm_tabw3mm_tabl2mm_tabs1_tab(inward)",
      )
      .json(),
  ).toEqual({ fn: "keywasher", ...props })
  expect(keyWasherModelPropsSchema.parse(props)).toEqual(props)
  expect(getKeyWasherDimensions(props).size).toEqual([20, 20, 1])
})
