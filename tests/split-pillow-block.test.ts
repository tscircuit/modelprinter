import { expect, test } from "bun:test"
import {
  getSplitPillowBlockDimensions,
  modelDefinitionSchema,
  parseModelString,
  splitPillowBlockModelPropsSchema,
} from "../src"

test("splitpillowblock resolves SNL 509 40mm-bore split pedestal housing", () => {
  const parsed = parseModelString(
    "splitpillowblock_bore40mm_l180mm_w60mm_h110mm_slotpitch150mm_slotw14mm_slotl20mm_base2slot",
  )
  expect(parsed).toEqual({
    fn: "splitpillowblock",
    boreDiameter: 40,
    length: 180,
    width: 60,
    height: 110,
    slotPitch: 150,
    slotWidth: 14,
    slotLength: 20,
    base2Slot: true,
  })
  expect(getSplitPillowBlockDimensions().topZ).toBe(110)
})

test("splitpillowblock supports 50mm bore SNL 511 variant and roundtrips", () => {
  const parsed = parseModelString(
    "splitpillowblock_bore50mm_l210mm_h125mm_slotpitch170mm",
  )
  expect(parsed.fn).toBe("splitpillowblock")
  if (parsed.fn !== "splitpillowblock") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(splitPillowBlockModelPropsSchema.parse({}).slotWidth).toBe(14)
})

test("splitpillowblock rejects legacy selectors and overflowing base slots", () => {
  expect(() => parseModelString("splitpillowblock_mount(base2slot)")).toThrow()
  expect(() =>
    parseModelString("splitpillowblock_l180mm_slotpitch170mm"),
  ).toThrow()
})
