import { expect, test } from "bun:test"
import {
  getSpeedNutDimensions,
  modelDefinitionSchema,
  parseModelString,
  speedNutModelPropsSchema,
} from "../src"

test("speednut resolves M4 10x14mm flat V-prong speed nut", () => {
  const parsed = parseModelString(
    "speednut_m4_w10mm_l14mm_h0.6mm_tabs2_tabh1.5mm_tabw3mm_vbend",
  )
  expect(parsed).toEqual({
    fn: "speednut",
    threadDiameter: 4,
    width: 10,
    length: 14,
    stripThickness: 0.6,
    tabs: 2,
    tabHeight: 1.5,
    tabWidth: 3,
    vBend: true,
  })
  expect(getSpeedNutDimensions().overallHeight).toBeCloseTo(2.1, 6)
})

test("speednut supports M5 12x18mm variant and roundtrips", () => {
  const parsed = parseModelString("speednut_m5_w12mm_l18mm")
  expect(parsed.fn).toBe("speednut")
  if (parsed.fn !== "speednut") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(speedNutModelPropsSchema.parse({}).tabs).toBe(2)
})

test("speednut rejects legacy selectors and oversized tabs", () => {
  expect(() => parseModelString("speednut_bend(v)")).toThrow()
  expect(() => parseModelString("speednut_w10mm_tabw9mm")).toThrow()
})
