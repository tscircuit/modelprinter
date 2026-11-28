import { expect, test } from "bun:test"
import {
  getSpokedWheelDimensions,
  modelDefinitionSchema,
  parseModelString,
  spokedWheelModelPropsSchema,
} from "../src"

test("spokedwheel resolves 150x25mm 6-spoke keyed wheel", () => {
  const parsed = parseModelString(
    "spokedwheel_od150mm_w25mm_bore15mm_spokes6_keyway_keyw5mm_hubw30mm",
  )
  expect(parsed).toEqual({
    fn: "spokedwheel",
    outerDiameter: 150,
    rimWidth: 25,
    boreDiameter: 15,
    spokes: 6,
    keyway: true,
    keyWidth: 5,
    hubWidth: 30,
  })
  expect(getSpokedWheelDimensions().overallWidth).toBe(30)
})

test("spokedwheel supports 200mm 8-spoke variant and schema roundtrip", () => {
  const parsed = parseModelString("spokedwheel_od200mm_spokes8_hubw35mm")
  expect(parsed.fn).toBe("spokedwheel")
  if (parsed.fn !== "spokedwheel") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(spokedWheelModelPropsSchema.parse({}).keyway).toBe(true)
})

test("spokedwheel rejects legacy selectors and oversized keyways", () => {
  expect(() => parseModelString("spokedwheel_mount(keyway)")).toThrow()
  expect(() => parseModelString("spokedwheel_bore15mm_keyw16mm")).toThrow()
})
