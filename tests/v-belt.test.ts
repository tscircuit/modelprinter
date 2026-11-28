import { expect, test } from "bun:test"
import {
  getVBeltDimensions,
  modelDefinitionSchema,
  parseModelString,
  vBeltModelPropsSchema,
} from "../src"

test("vbelt resolves 500mm 10x6mm 40-degree trapezoidal V-belt", () => {
  const parsed = parseModelString(
    "vbelt_l500mm_w10mm_h6mm_customv_sideangle40deg_endless",
  )
  expect(parsed).toEqual({
    fn: "vbelt",
    length: 500,
    topWidth: 10,
    height: 6,
    customV: true,
    sideAngle: 40,
    endless: true,
  })

  const dims = getVBeltDimensions()
  expect(dims.bottomWidth).toBeCloseTo(10 - 12 * Math.tan((20 * Math.PI) / 180))
  expect(dims.outerLoopDiameter).toBeCloseTo(500 / Math.PI)
})

test("vbelt supports 80cm variant and schema roundtrip", () => {
  const parsed = parseModelString("vbelt_l80cm_w13mm_h8mm_sideangle38deg")
  expect(parsed.fn).toBe("vbelt")
  if (parsed.fn !== "vbelt") return
  expect(parsed.length).toBeCloseTo(800)
  expect(parsed.sideAngle).toBe(38)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(vBeltModelPropsSchema.parse({}).endless).toBe(true)
})

test("vbelt rejects legacy selectors and collapsing trapezoidal widths", () => {
  expect(() =>
    parseModelString("vbelt_profile(customv)_style(endless)"),
  ).toThrow()
  expect(() => parseModelString("vbelt_w6mm_h10mm_sideangle40deg")).toThrow()
})
