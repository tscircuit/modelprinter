import { expect, test } from "bun:test"
import { mp, keyWasherModelPropsSchema } from "../src"
test("keywasher rejects ambiguous and physically incompatible inputs", () => {
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
  for (const source of [
    "keywasher_id10mm_od20mm_h1mm_tabw3mm_tabl2mm_tabs1_inward_unknown1mm",
    "keywasher_id10mm_od20mm_h1mm_tabw3mm_tabl2mm_tabs1_inward_tabs2",
    "keywasher",
  ])
    expect(() => mp.string(source).json()).toThrow()
  expect(() =>
    keyWasherModelPropsSchema.parse({ ...props, ...{ tabLength: 5 } }),
  ).toThrow()
  expect(() =>
    keyWasherModelPropsSchema.parse({ ...props, innerDiameter: Infinity }),
  ).toThrow()
  expect(() =>
    keyWasherModelPropsSchema.parse({ ...props, innerDiameter: "12mmjunk" }),
  ).toThrow()
})
