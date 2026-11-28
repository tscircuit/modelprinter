import { expect, test } from "bun:test"
import {
  dinRailClipModelPropsSchema,
  getDinRailClipDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("dinrailclip resolves 20x35x8mm spring-leaf TH35x7.5 clip", () => {
  const parsed = parseModelString(
    "dinrailclip_th35x7.5_w20mm_d35mm_h8mm_t1mm_hooks2_hole4mm_springleaf",
  )
  expect(parsed).toEqual({
    fn: "dinrailclip",
    th35x75: true,
    width: 20,
    depth: 35,
    height: 8,
    thickness: 1,
    hooks: 2,
    holeDiameter: 4,
    springLeaf: true,
  })
  expect(getDinRailClipDimensions().dinRailWidth).toBe(35)
})

test("dinrailclip supports 25mm clip variant and schema roundtrip", () => {
  const parsed = parseModelString("dinrailclip_w25mm_d42mm_hole5mm")
  expect(parsed.fn).toBe("dinrailclip")
  if (parsed.fn !== "dinrailclip") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(dinRailClipModelPropsSchema.parse({}).springLeaf).toBe(true)
})

test("dinrailclip rejects legacy selectors and undersized rail spans", () => {
  expect(() =>
    parseModelString("dinrailclip_rail(TH35x7.5)_type(springleaf)"),
  ).toThrow()
  expect(() => parseModelString("dinrailclip_d28mm")).toThrow()
})
