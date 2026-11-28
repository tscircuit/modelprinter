import { expect, test } from "bun:test"
import {
  bondedSealingWasherModelPropsSchema,
  getBondedSealingWasherDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("bondedsealingwasher resolves M6 6x14mm double-lip Dowty seal", () => {
  const parsed = parseModelString(
    "bondedsealingwasher_id6mm_metalid8mm_od14mm_metalh1.5mm_sealod9mm_sealh2mm_doublelip",
  )
  expect(parsed).toEqual({
    fn: "bondedsealingwasher",
    innerDiameter: 6,
    metalInnerDiameter: 8,
    outerDiameter: 14,
    metalHeight: 1.5,
    sealOuterDiameter: 9,
    sealHeight: 2,
    doubleLip: true,
  })
  expect(getBondedSealingWasherDimensions().lipProtrusionPerFace).toBe(0.25)
})

test("bondedsealingwasher supports G1/4 13x20mm bonded seal and roundtrips", () => {
  const parsed = parseModelString(
    "bondedsealingwasher_id13mm_metalid15mm_sealod16mm_od20.5mm",
  )
  expect(parsed.fn).toBe("bondedsealingwasher")
  if (parsed.fn !== "bondedsealingwasher") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(bondedSealingWasherModelPropsSchema.parse({}).metalHeight).toBe(1.5)
})

test("bondedsealingwasher rejects recessed seals and legacy selectors", () => {
  expect(() =>
    parseModelString("bondedsealingwasher_seal(doublelip)"),
  ).toThrow()
  expect(() =>
    parseModelString("bondedsealingwasher_metalh2mm_sealh1.5mm"),
  ).toThrow()
})
