import { expect, test } from "bun:test"
import {
  getGroundingBusbarDimensions,
  groundingBusbarModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("groundingbusbar resolves 8-bore 80x15x5mm M4 ground bar", () => {
  const parsed = parseModelString(
    "groundingbusbar_l80mm_w15mm_t5mm_bores8_bore4mm_p8mm_screwm4_mounts2_hole4mm_hp68mm",
  )
  expect(parsed).toEqual({
    fn: "groundingbusbar",
    length: 80,
    width: 15,
    thickness: 5,
    bores: 8,
    boreDiameter: 4,
    pitch: 8,
    screwThread: "m4",
    mounts: 2,
    holeDiameter: 4,
    holePitch: 68,
  })

  const dims = getGroundingBusbarDimensions()
  expect(dims.conductorSpan).toBe(56)
  expect(dims.screwMajorDiameter).toBe(4)
  expect(dims.topZ).toBe(15)
})

test("groundingbusbar supports 12-bore variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "groundingbusbar_l120mm_bores12_hp108mm_screwM5",
  )
  expect(parsed.fn).toBe("groundingbusbar")
  if (parsed.fn !== "groundingbusbar") return
  expect(parsed.screwThread).toBe("m5")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(groundingBusbarModelPropsSchema.parse({}).mounts).toBe(2)
})

test("groundingbusbar rejects overlapping conductor arrays and parenthesized tokens", () => {
  expect(() => parseModelString("groundingbusbar_mount(ears)")).toThrow()
  expect(() =>
    parseModelString("groundingbusbar_l80mm_bores10_p8mm_hp68mm"),
  ).toThrow()
})
