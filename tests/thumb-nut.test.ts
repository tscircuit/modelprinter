import { expect, test } from "bun:test"
import {
  getThumbNutDimensions,
  modelDefinitionSchema,
  parseModelString,
  thumbNutModelPropsSchema,
} from "../src"

test("thumbnut resolves M4 12x6mm straight-knurled through thumb nut", () => {
  const parsed = parseModelString(
    "thumbnut_m4_od12mm_h6mm_knurlp1mm_chamfer0.5mm_through_straightknurl",
  )
  expect(parsed).toEqual({
    fn: "thumbnut",
    threadDiameter: 4,
    outerDiameter: 12,
    height: 6,
    knurlPitch: 1,
    chamfer: 0.5,
    boreStyle: "through",
    knurlStyle: "straightknurl",
  })
  expect(getThumbNutDimensions().knurlBandHeight).toBe(5)
})

test("thumbnut supports M6 blind diamond-knurl variant and roundtrips", () => {
  const parsed = parseModelString("thumbnut_m6_od16mm_h8mm_blind_diamondknurl")
  expect(parsed.fn).toBe("thumbnut")
  if (parsed.fn !== "thumbnut") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(thumbNutModelPropsSchema.parse({}).outerDiameter).toBe(12)
})

test("thumbnut rejects legacy selectors and oversized chamfers", () => {
  expect(() => parseModelString("thumbnut_knurl(straight)")).toThrow()
  expect(() => parseModelString("thumbnut_h6mm_chamfer3mm")).toThrow()
})
