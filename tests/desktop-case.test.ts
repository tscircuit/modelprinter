import { expect, test } from "bun:test"
import {
  desktopCaseModelPropsSchema,
  getDesktopCaseDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("desktopcase resolves 160x120x50mm instrument housing", () => {
  const parsed = parseModelString(
    "desktopcase_w160mm_d120mm_h50mm_wall2mm_corner4mm_bezel5mm_bottomscrewlid_screws4_hp(140mm,100mm)",
  )
  expect(parsed).toEqual({
    fn: "desktopcase",
    width: 160,
    depth: 120,
    height: 50,
    wallThickness: 2,
    cornerRadius: 4,
    bezelDepth: 5,
    bottomScrewLid: true,
    screws: 4,
    holePitchX: 140,
    holePitchY: 100,
  })

  const dims = getDesktopCaseDimensions()
  expect(dims.innerWidth).toBe(156)
  expect(dims.innerDepth).toBe(116)
  expect(dims.topZ).toBe(50)
})

test("desktopcase supports square-corner variant and schema roundtrip", () => {
  const parsed = parseModelString("desktopcase_w20cm_corner0mm_hp(170mm,100mm)")
  expect(parsed.fn).toBe("desktopcase")
  if (parsed.fn !== "desktopcase") return
  expect(parsed.width).toBeCloseTo(200)
  expect(parsed.cornerRadius).toBe(0)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(desktopCaseModelPropsSchema.parse({}).bottomScrewLid).toBe(true)
})

test("desktopcase rejects legacy lid selectors and overflowing screw pitches", () => {
  expect(() => parseModelString("desktopcase_lid(bottomscrew)")).toThrow()
  expect(() =>
    parseModelString("desktopcase_w160mm_wall2mm_hp(158mm,100mm)"),
  ).toThrow()
})
