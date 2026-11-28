import { expect, test } from "bun:test"
import {
  getSquareSectionSealDimensions,
  modelDefinitionSchema,
  parseModelString,
  squareSectionSealModelPropsSchema,
} from "../src"

test("squaresectionseal resolves 20mm ID x 2mm square sealing ring", () => {
  const parsed = parseModelString(
    "squaresectionseal_id20mm_section2mm_squareprofile_cornerr0.2mm",
  )
  expect(parsed).toEqual({
    fn: "squaresectionseal",
    innerDiameter: 20,
    sectionWidth: 2,
    squareProfile: true,
    cornerRadius: 0.2,
  })
  expect(getSquareSectionSealDimensions().outerDiameter).toBe(24)
})

test("squaresectionseal supports sharp-corner variant and roundtrips", () => {
  const parsed = parseModelString("squaresectionseal_id35mm_cornerr0mm")
  expect(parsed.fn).toBe("squaresectionseal")
  if (parsed.fn !== "squaresectionseal") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(squareSectionSealModelPropsSchema.parse({}).squareProfile).toBe(true)
})

test("squaresectionseal rejects legacy selectors and oversized fillets", () => {
  expect(() => parseModelString("squaresectionseal_profile(square)")).toThrow()
  expect(() =>
    parseModelString("squaresectionseal_section2mm_cornerr1.1mm"),
  ).toThrow()
})
