import { expect, test } from "bun:test"
import {
  getPillowBlockDimensions,
  modelDefinitionSchema,
  parseModelString,
  pillowBlockModelPropsSchema,
} from "../src"

test("pillowblock resolves UCP204-class 20mm pedestal housing and base slots", () => {
  const parsed = parseModelString(
    "pillowblock_bore20mm_l127mm_w38mm_h65mm_base2slot_slotw10mm_slotl15mm_slotpitch95mm",
  )
  expect(parsed).toEqual({
    fn: "pillowblock",
    boreDiameter: 20,
    length: 127,
    width: 38,
    height: 65,
    base2Slot: true,
    slotWidth: 10,
    slotLength: 15,
    slotPitch: 95,
  })

  const dims = getPillowBlockDimensions()
  expect(dims.leftSlotX).toBe(-47.5)
  expect(dims.rightSlotX).toBe(47.5)
  expect(dims.bottomZ).toBe(0)
  expect(dims.topZ).toBe(65)
})

test("pillowblock supports unit conversions and schema roundtrip", () => {
  const parsed = parseModelString("pillowblock_bore1.2cm_l100mm_slotpitch76mm")
  expect(parsed.fn).toBe("pillowblock")
  if (parsed.fn !== "pillowblock") return
  expect(parsed.boreDiameter).toBeCloseTo(12)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(pillowBlockModelPropsSchema.parse({}).base2Slot).toBe(true)
})

test("pillowblock rejects legacy mount selectors, oversized bores and overflowing slots", () => {
  expect(() =>
    parseModelString("pillowblock_bore20mm_mount(base2slot)"),
  ).toThrow()
  expect(() =>
    parseModelString("pillowblock_l100mm_slotl20mm_slotpitch85mm"),
  ).toThrow()
  expect(() => parseModelString("pillowblock_bore60mm_h65mm")).toThrow()
})
