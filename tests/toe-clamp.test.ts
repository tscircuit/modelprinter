import { expect, test } from "bun:test"
import {
  getToeClampDimensions,
  modelDefinitionSchema,
  parseModelString,
  toeClampModelPropsSchema,
} from "../src"

test("toeclamp resolves 60x30x25mm 5mm-nose fixture toe clamp", () => {
  const parsed = parseModelString(
    "toeclamp_l60mm_w30mm_h25mm_toel8mm_toeh5mm_mountslotw8mm_mountslotl30mm_slotcenter35mm",
  )
  expect(parsed).toEqual({
    fn: "toeclamp",
    length: 60,
    width: 30,
    height: 25,
    toeLength: 8,
    toeHeight: 5,
    mountSlotWidth: 8,
    mountSlotLength: 30,
    slotCenter: 35,
  })
  expect(getToeClampDimensions().stepDrop).toBe(20)
})

test("toeclamp supports 80mm M10-slot clamp and roundtrips", () => {
  const parsed = parseModelString(
    "toeclamp_l80mm_w35mm_mountslotw10.5mm_slotcenter45mm",
  )
  expect(parsed.fn).toBe("toeclamp")
  if (parsed.fn !== "toeclamp") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(toeClampModelPropsSchema.parse({}).toeHeight).toBe(5)
})

test("toeclamp rejects colliding slots and parenthesized tokens", () => {
  expect(() => parseModelString("toeclamp_jaw(serrated)")).toThrow()
  expect(() => parseModelString("toeclamp_l60mm_slotcenter50mm")).toThrow()
})
