import { expect, test } from "bun:test"
import {
  getHeatsinkClipDimensions,
  heatsinkClipModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("heatsinkclip resolves 12x35x10mm stamped spring-bridge clip", () => {
  const parsed = parseModelString(
    "heatsinkclip_w12mm_l35mm_h10mm_t0.8mm_hookd3mm_springbridge",
  )
  expect(parsed).toEqual({
    fn: "heatsinkclip",
    width: 12,
    length: 35,
    height: 10,
    stripThickness: 0.8,
    hookDepth: 3,
    springBridge: true,
  })
  expect(getHeatsinkClipDimensions().archDeflectionClearance).toBeCloseTo(
    6.2,
    6,
  )
})

test("heatsinkclip supports 50mm BGA heatsink clip and roundtrips", () => {
  const parsed = parseModelString("heatsinkclip_l50mm_h12mm")
  expect(parsed.fn).toBe("heatsinkclip")
  if (parsed.fn !== "heatsinkclip") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(heatsinkClipModelPropsSchema.parse({}).hookDepth).toBe(3)
})

test("heatsinkclip rejects legacy selectors and oversized hook depths", () => {
  expect(() => parseModelString("heatsinkclip_shape(springbridge)")).toThrow()
  expect(() => parseModelString("heatsinkclip_h10mm_hookd9mm")).toThrow()
})
