import { expect, test } from "bun:test"
import {
  getTSlotTeePlateDimensions,
  modelDefinitionSchema,
  parseModelString,
  tSlotTeePlateModelPropsSchema,
} from "../src"

test("tslotteeplate resolves 80x60x4mm 5-hole 20-series tee plate", () => {
  const parsed = parseModelString(
    "tslotteeplate_w80mm_h60mm_armw20mm_t4mm_holes5_hole5mm_p20mm_tee",
  )
  expect(parsed).toEqual({
    fn: "tslotteeplate",
    width: 80,
    height: 60,
    armWidth: 20,
    thickness: 4,
    holes: 5,
    holeDiameter: 5,
    holePitch: 20,
    teeShape: true,
  })
  expect(getTSlotTeePlateDimensions().stemLength).toBe(40)
})

test("tslotteeplate supports 30-series 90x90mm plate and roundtrips", () => {
  const parsed = parseModelString(
    "tslotteeplate_w90mm_h90mm_armw30mm_hole6mm_p30mm",
  )
  expect(parsed.fn).toBe("tslotteeplate")
  if (parsed.fn !== "tslotteeplate") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(tSlotTeePlateModelPropsSchema.parse({}).holes).toBe(5)
})

test("tslotteeplate rejects legacy selectors and overflowing pitches", () => {
  expect(() => parseModelString("tslotteeplate_shape(tee)")).toThrow()
  expect(() => parseModelString("tslotteeplate_w80mm_p40mm")).toThrow()
})
