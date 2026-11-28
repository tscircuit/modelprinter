import { expect, test } from "bun:test"
import {
  externalCirclipModelPropsSchema,
  getExternalCirclipDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("externalcirclip resolves DIN 471 10mm shaft retaining ring", () => {
  const parsed = parseModelString("externalcirclip_din471_shaftd10mm_free")
  expect(parsed).toEqual({
    fn: "externalcirclip",
    din471: true,
    shaftDiameter: 10,
    free: true,
  })

  const dims = getExternalCirclipDimensions({ shaftDiameter: 10 })
  expect(dims.grooveDiameter).toBeCloseTo(9.6)
  expect(dims.thickness).toBeCloseTo(1.0)
  expect(dims.freeInnerDiameter).toBeCloseTo(9.3)
  expect(dims.outerEnvelopeDiameter).toBeCloseTo(17.0)
  expect(dims.lugCount).toBe(2)
})

test("externalcirclip supports unit conversion and schema roundtrip", () => {
  const parsed = parseModelString("externalcirclip_shaftd2cm")
  expect(parsed.fn).toBe("externalcirclip")
  if (parsed.fn !== "externalcirclip") return
  expect(parsed.shaftDiameter).toBeCloseTo(20)
  expect(parsed.din471).toBe(true)
  expect(parsed.free).toBe(true)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(
    externalCirclipModelPropsSchema.parse({ shaftDiameter: "12mm" })
      .shaftDiameter,
  ).toBe(12)
})

test("externalcirclip rejects parenthesized selectors and non-table shaft sizes", () => {
  expect(() =>
    parseModelString("externalcirclip_standard(din471)_shaftd10mm_state(free)"),
  ).toThrow()
  expect(() => parseModelString("externalcirclip_shaftd11mm")).toThrow()
})
