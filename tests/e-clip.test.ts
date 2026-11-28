import { expect, test } from "bun:test"
import {
  eClipModelPropsSchema,
  getEClipDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("eclip resolves DIN 6799 free-state E-ring envelope and groove shoulder", () => {
  const parsed = parseModelString("eclip_din6799_shaftd6mm_grooved5mm_free")
  expect(parsed).toEqual({
    fn: "eclip",
    din6799: true,
    shaftDiameter: 6,
    grooveDiameter: 5,
    free: true,
  })

  const dims = getEClipDimensions({
    shaftDiameter: 6,
    grooveDiameter: 5,
  })
  expect(dims.thickness).toBeCloseTo(0.7)
  expect(dims.freeInnerDiameter).toBeCloseTo(4.85)
  expect(dims.outerDiameter).toBeCloseTo(11.3)
  expect(dims.grooveShoulderDepth).toBeCloseTo(0.5)
  expect(dims.prongCount).toBe(3)
  expect(dims.bottomZ).toBe(0)
  expect(dims.topZ).toBeCloseTo(0.7)
})

test("eclip normalizes units, defaults flags and roundtrips through modelDefinitionSchema", () => {
  const parsed = parseModelString("eclip_shaftd0.6cm_grooved0.5cm")
  expect(parsed.fn).toBe("eclip")
  if (parsed.fn !== "eclip") return
  expect(parsed.din6799).toBe(true)
  expect(parsed.free).toBe(true)
  expect(parsed.shaftDiameter).toBeCloseTo(6)
  expect(parsed.grooveDiameter).toBeCloseTo(5)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(
    eClipModelPropsSchema.parse({
      shaftDiameter: "6mm",
      grooveDiameter: "5mm",
    }).din6799,
  ).toBe(true)
})

test("eclip rejects legacy selectors, untabulated grooves and out-of-range shafts", () => {
  expect(() =>
    parseModelString(
      "eclip_standard(din6799)_shaftd6mm_grooved5mm_state(free)",
    ),
  ).toThrow()
  expect(() =>
    parseModelString("eclip_din6799_shaftd6mm_grooved5.5mm_free"),
  ).toThrow()
  expect(() =>
    parseModelString("eclip_din6799_shaftd9mm_grooved5mm_free"),
  ).toThrow()
  expect(() =>
    parseModelString("eclip_din6799_shaftd5mm_grooved5mm_free"),
  ).toThrow()
})
