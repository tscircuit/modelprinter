import { expect, test } from "bun:test"
import {
  flatBeltModelPropsSchema,
  getFlatBeltDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("flatbelt resolves 600x25x2mm endless flat drive belt", () => {
  const parsed = parseModelString(
    "flatbelt_l600mm_w25mm_h2mm_endless_rectangular",
  )
  expect(parsed).toEqual({
    fn: "flatbelt",
    pitchLength: 600,
    width: 25,
    thickness: 2,
    endless: true,
    rectangular: true,
  })
  expect(getFlatBeltDimensions().loopCenterDiameter).toBeCloseTo(
    600 / Math.PI,
    4,
  )
})

test("flatbelt supports 900x40x3mm variant and schema roundtrip", () => {
  const parsed = parseModelString("flatbelt_l900mm_w40mm_h3mm")
  expect(parsed.fn).toBe("flatbelt")
  if (parsed.fn !== "flatbelt") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(flatBeltModelPropsSchema.parse({}).rectangular).toBe(true)
})

test("flatbelt rejects legacy selectors and inverted aspect ratios", () => {
  expect(() =>
    parseModelString("flatbelt_style(endless)_section(rectangular)"),
  ).toThrow()
  expect(() => parseModelString("flatbelt_w10mm_h12mm")).toThrow()
})
