import { expect, test } from "bun:test"
import {
  cageNutModelPropsSchema,
  getCageNutDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("cagenut resolves M6 19-inch rack snap-in cage nut", () => {
  const parsed = parseModelString(
    "cagenut_m6_nutw10mm_nuth5mm_cagew14mm_cageh10mm_wall0.8mm_earspan18mm_opposedears",
  )
  expect(parsed).toEqual({
    fn: "cagenut",
    threadDiameter: 6,
    nutWidth: 10,
    nutHeight: 5,
    cageWidth: 14,
    cageHeight: 10,
    wallThickness: 0.8,
    earSpan: 18,
    opposedEars: true,
  })
  expect(getCageNutDimensions().earOverhang).toBe(2)
})

test("cagenut supports M5 cage nut variant and roundtrips", () => {
  const parsed = parseModelString("cagenut_m5_earspan19mm")
  expect(parsed.fn).toBe("cagenut")
  if (parsed.fn !== "cagenut") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(cageNutModelPropsSchema.parse({}).nutWidth).toBe(10)
})

test("cagenut rejects non-projecting ears and legacy selectors", () => {
  expect(() => parseModelString("cagenut_ears(opposed)")).toThrow()
  expect(() => parseModelString("cagenut_cagew14mm_earspan14mm")).toThrow()
})
