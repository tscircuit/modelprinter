import { expect, test } from "bun:test"
import {
  getWedgeAnchorDimensions,
  modelDefinitionSchema,
  parseModelString,
  wedgeAnchorModelPropsSchema,
} from "../src"

test("wedgeanchor resolves M8x75mm concrete wedge stud anchor", () => {
  const parsed = parseModelString(
    "wedgeanchor_m8_l75mm_threadl30mm_clipod10mm_clipl12mm_coneod10mm_conel10mm_headless_unset",
  )
  expect(parsed).toEqual({
    fn: "wedgeanchor",
    threadDiameter: 8,
    length: 75,
    threadLength: 30,
    clipOuterDiameter: 10,
    clipLength: 12,
    coneOuterDiameter: 10,
    coneLength: 10,
    headless: true,
    unset: true,
  })
  expect(getWedgeAnchorDimensions().shankLength).toBe(23)
})

test("wedgeanchor supports M12x110mm heavy stud anchor and roundtrips", () => {
  const parsed = parseModelString(
    "wedgeanchor_m12_l110mm_threadl50mm_clipod14mm_coneod14mm",
  )
  expect(parsed.fn).toBe("wedgeanchor")
  if (parsed.fn !== "wedgeanchor") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(wedgeAnchorModelPropsSchema.parse({}).clipLength).toBe(12)
})

test("wedgeanchor rejects legacy selectors and overflowing sub-lengths", () => {
  expect(() => parseModelString("wedgeanchor_state(unset)")).toThrow()
  expect(() => parseModelString("wedgeanchor_l45mm_threadl30mm")).toThrow()
})
