import { expect, test } from "bun:test"
import {
  getInternalCirclipDimensions,
  internalCirclipModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("internalcirclip resolves DIN 472 25mm bore retaining ring", () => {
  const parsed = parseModelString("internalcirclip_din472_bored25mm_free")
  expect(parsed).toEqual({
    fn: "internalcirclip",
    din472: true,
    boreDiameter: 25,
    free: true,
  })

  const dims = getInternalCirclipDimensions({ boreDiameter: 25 })
  expect(dims.grooveDiameter).toBeCloseTo(26.2)
  expect(dims.freeOuterDiameter).toBeCloseTo(26.9)
  expect(dims.thickness).toBeCloseTo(1.2)
  expect(dims.lugCount).toBe(2)
})

test("internalcirclip supports cm units and schema roundtrip", () => {
  const parsed = parseModelString("internalcirclip_bored3cm")
  expect(parsed.fn).toBe("internalcirclip")
  if (parsed.fn !== "internalcirclip") return
  expect(parsed.boreDiameter).toBeCloseTo(30)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(
    internalCirclipModelPropsSchema.parse({ boreDiameter: "20mm" })
      .boreDiameter,
  ).toBe(20)
})

test("internalcirclip rejects legacy selectors and non-table bore diameters", () => {
  expect(() =>
    parseModelString("internalcirclip_standard(din472)_bored25mm_state(free)"),
  ).toThrow()
  expect(() => parseModelString("internalcirclip_bored23mm")).toThrow()
})
