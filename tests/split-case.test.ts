import { expect, test } from "bun:test"
import {
  getSplitCaseDimensions,
  modelDefinitionSchema,
  parseModelString,
  splitCaseModelPropsSchema,
} from "../src"

test("splitcase resolves 100x60x28 clamshell split seam and interior cavity", () => {
  const parsed = parseModelString(
    "splitcase_w100mm_d60mm_h28mm_wall2mm_corner3mm_split14mm_seamlap2mm_screwonlid_screws4_hole3mm_hp(86mm,46mm)",
  )
  expect(parsed).toEqual({
    fn: "splitcase",
    width: 100,
    depth: 60,
    height: 28,
    wallThickness: 2,
    cornerRadius: 3,
    splitHeight: 14,
    seamLap: 2,
    screwOnLid: true,
    screws: 4,
    screwHoleDiameter: 3,
    holePitchX: 86,
    holePitchY: 46,
  })

  const dims = getSplitCaseDimensions()
  expect(dims.upperShellHeight).toBe(14)
  expect(dims.seamZ).toBe(14)
  expect(dims.innerWidth).toBe(96)
  expect(dims.topZ).toBe(28)
})

test("splitcase supports asymmetric split heights and schema roundtrip", () => {
  const parsed = parseModelString("splitcase_h32mm_split18mm_corner0mm_screwon")
  expect(parsed.fn).toBe("splitcase")
  if (parsed.fn !== "splitcase") return
  expect(parsed.splitHeight).toBe(18)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(splitCaseModelPropsSchema.parse({}).screws).toBe(4)
})

test("splitcase rejects legacy lid selectors, invalid seam heights and wide screw pitches", () => {
  expect(() =>
    parseModelString("splitcase_w100mm_d60mm_lid(screwon)"),
  ).toThrow()
  expect(() =>
    parseModelString("splitcase_h28mm_wall2mm_seamlap2mm_split26mm"),
  ).toThrow()
  expect(() =>
    parseModelString("splitcase_w100mm_wall2mm_hole3mm_hp(95mm,46mm)"),
  ).toThrow()
})
