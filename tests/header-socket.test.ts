import { expect, test } from "bun:test"
import {
  getHeaderSocketDimensions,
  headerSocketModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("headersocket resolves 2x3 2.54mm-pitch vertical female socket", () => {
  const parsed = parseModelString(
    "headersocket_p2.54mm_n6_rows2_w7.62mm_d5.08mm_h8mm_tail3mm_pin0.64mm_female_throughhole_vertical",
  )
  expect(parsed).toEqual({
    fn: "headersocket",
    pitch: 2.54,
    contacts: 6,
    rows: 2,
    width: 7.62,
    depth: 5.08,
    height: 8,
    tailLength: 3,
    pinThickness: 0.64,
    female: true,
    throughHole: true,
    vertical: true,
  })
  expect(getHeaderSocketDimensions().columns).toBe(3)
})

test("headersocket supports 2x5 10-pin socket and roundtrips", () => {
  const parsed = parseModelString("headersocket_n10_w12.7mm")
  expect(parsed.fn).toBe("headersocket")
  if (parsed.fn !== "headersocket") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(headerSocketModelPropsSchema.parse({}).pitch).toBe(2.54)
})

test("headersocket rejects indivisible contact counts and legacy selectors", () => {
  expect(() => parseModelString("headersocket_gender(female)")).toThrow()
  expect(() => parseModelString("headersocket_n5_rows2")).toThrow()
})
