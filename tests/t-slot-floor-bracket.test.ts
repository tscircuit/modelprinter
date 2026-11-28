import { expect, test } from "bun:test"
import {
  getTSlotFloorBracketDimensions,
  modelDefinitionSchema,
  parseModelString,
  tSlotFloorBracketModelPropsSchema,
} from "../src"

test("tslotfloorbracket resolves 60x50x70mm 2-rib floor anchor bracket", () => {
  const parsed = parseModelString(
    "tslotfloorbracket_w60mm_d50mm_h70mm_t5mm_ribs2_ribt4mm_hole6mm_basehp40mm_wallhp40mm",
  )
  expect(parsed).toEqual({
    fn: "tslotfloorbracket",
    width: 60,
    depth: 50,
    height: 70,
    thickness: 5,
    ribs: 2,
    ribThickness: 4,
    holeDiameter: 6,
    baseHolePitch: 40,
    wallHolePitch: 40,
  })
  expect(getTSlotFloorBracketDimensions().gussetHeight).toBe(65)
})

test("tslotfloorbracket supports 80mm wide heavy anchor and roundtrips", () => {
  const parsed = parseModelString(
    "tslotfloorbracket_w80mm_h90mm_hole8mm_basehp50mm_wallhp50mm",
  )
  expect(parsed.fn).toBe("tslotfloorbracket")
  if (parsed.fn !== "tslotfloorbracket") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(tSlotFloorBracketModelPropsSchema.parse({}).ribs).toBe(2)
})

test("tslotfloorbracket rejects overflowing bolt pitches and parenthesized tokens", () => {
  expect(() => parseModelString("tslotfloorbracket_mount(floor)")).toThrow()
  expect(() => parseModelString("tslotfloorbracket_w60mm_basehp55mm")).toThrow()
})
