import { expect, test } from "bun:test"
import {
  flatBeltPulleyModelPropsSchema,
  getFlatBeltPulleyDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("flatbeltpulley resolves 80x30mm 12mm-bore keyed flat pulley", () => {
  const parsed = parseModelString(
    "flatbeltpulley_od80mm_bore12mm_w30mm_flatrim_keyway_keyw4mm",
  )
  expect(parsed).toEqual({
    fn: "flatbeltpulley",
    outerDiameter: 80,
    boreDiameter: 12,
    width: 30,
    flatRim: true,
    keyway: true,
    keyWidth: 4,
  })
  expect(getFlatBeltPulleyDimensions().radialThickness).toBe(34)
})

test("flatbeltpulley supports 100mm 16mm-bore variant and roundtrips", () => {
  const parsed = parseModelString("flatbeltpulley_od100mm_bore16mm_keyw5mm")
  expect(parsed.fn).toBe("flatbeltpulley")
  if (parsed.fn !== "flatbeltpulley") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(flatBeltPulleyModelPropsSchema.parse({}).flatRim).toBe(true)
})

test("flatbeltpulley rejects legacy selectors and oversized keyways", () => {
  expect(() =>
    parseModelString("flatbeltpulley_profile(flatrim)_mount(keyway)"),
  ).toThrow()
  expect(() => parseModelString("flatbeltpulley_bore12mm_keyw14mm")).toThrow()
})
