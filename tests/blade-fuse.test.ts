import { expect, test } from "bun:test"
import {
  bladeFuseModelPropsSchema,
  getBladeFuseDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("bladefuse resolves regular 19.1x12x5.1mm flat blade fuse", () => {
  const parsed = parseModelString(
    "bladefuse_regularflatblade_w19.1mm_bodyh12mm_t5.1mm_blades2_bladel7mm_bladew5.2mm_bladet0.65mm_p8mm",
  )
  expect(parsed).toEqual({
    fn: "bladefuse",
    regularFlatBlade: true,
    width: 19.1,
    bodyHeight: 12,
    thickness: 5.1,
    blades: 2,
    bladeLength: 7,
    bladeWidth: 5.2,
    bladeThickness: 0.65,
    pitch: 8,
  })

  const dims = getBladeFuseDimensions()
  expect(dims.overallHeight).toBe(19)
  expect(dims.bladeInnerGap).toBeCloseTo(2.8, 5)
  expect(dims.bottomZ).toBe(-7)
})

test("bladefuse supports taller housing variant and schema roundtrip", () => {
  const parsed = parseModelString("bladefuse_bodyh14mm_bladel8mm")
  expect(parsed.fn).toBe("bladefuse")
  if (parsed.fn !== "bladefuse") return
  expect(parsed.bodyHeight).toBe(14)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(bladeFuseModelPropsSchema.parse({}).regularFlatBlade).toBe(true)
})

test("bladefuse rejects legacy selectors and touching blades", () => {
  expect(() => parseModelString("bladefuse_form(regularflatblade)")).toThrow()
  expect(() => parseModelString("bladefuse_bladew8.5mm_p8mm")).toThrow()
})
