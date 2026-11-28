import { expect, test } from "bun:test"
import {
  getTSlotCrossPlateDimensions,
  modelDefinitionSchema,
  parseModelString,
  tSlotCrossPlateModelPropsSchema,
} from "../src"

test("tslotcrossplate resolves 80x80x4mm 5-hole cruciform plate", () => {
  const parsed = parseModelString(
    "tslotcrossplate_w80mm_h80mm_armw20mm_t4mm_holes5_hole5mm_p30mm_cross",
  )
  expect(parsed).toEqual({
    fn: "tslotcrossplate",
    width: 80,
    height: 80,
    armWidth: 20,
    thickness: 4,
    holes: 5,
    holeDiameter: 5,
    holePitch: 30,
    crossShape: true,
  })
  expect(getTSlotCrossPlateDimensions().armProjectionX).toBe(30)
})

test("tslotcrossplate supports 120x120mm 30-series plate and roundtrips", () => {
  const parsed = parseModelString(
    "tslotcrossplate_w120mm_h120mm_armw30mm_hole6mm_p40mm",
  )
  expect(parsed.fn).toBe("tslotcrossplate")
  if (parsed.fn !== "tslotcrossplate") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(tSlotCrossPlateModelPropsSchema.parse({}).holePitch).toBe(30)
})

test("tslotcrossplate rejects legacy selectors and overflowing pitches", () => {
  expect(() => parseModelString("tslotcrossplate_shape(cross)")).toThrow()
  expect(() => parseModelString("tslotcrossplate_w80mm_p38mm")).toThrow()
})
