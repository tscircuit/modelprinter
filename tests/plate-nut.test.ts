import { expect, test } from "bun:test"
import {
  getPlateNutDimensions,
  modelDefinitionSchema,
  parseModelString,
  plateNutModelPropsSchema,
} from "../src"

test("platenut resolves M4 two-lug rivet anchor nut", () => {
  const parsed = parseModelString(
    "platenut_custom_m4_w12mm_l28mm_strip0.8mm_holep20mm_rivetholed3mm_nutod7mm_nuth4mm_flat",
  )
  expect(parsed).toEqual({
    fn: "platenut",
    custom: true,
    thread: "m4",
    width: 12,
    length: 28,
    stripThickness: 0.8,
    holePitch: 20,
    rivetHoleDiameter: 3,
    nutOuterDiameter: 7,
    nutHeight: 4,
    flat: true,
  })
  expect(getPlateNutDimensions().overallHeight).toBeCloseTo(4.8)
})

test("platenut supports M5 variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "platenut_M5_w14mm_l32mm_holep24mm_nutod8.5mm",
  )
  expect(parsed.fn).toBe("platenut")
  if (parsed.fn !== "platenut") return
  expect(parsed.thread).toBe("m5")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(plateNutModelPropsSchema.parse({}).flat).toBe(true)
})

test("platenut rejects legacy selectors and overlapping rivet holes", () => {
  expect(() => parseModelString("platenut_spec(custom)_form(flat)")).toThrow()
  expect(() =>
    parseModelString("platenut_holep9mm_nutod7mm_rivetholed3mm"),
  ).toThrow()
})
