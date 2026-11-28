import { expect, test } from "bun:test"
import {
  getTSlotNutDimensions,
  modelDefinitionSchema,
  parseModelString,
  tSlotNutModelPropsSchema,
} from "../src"

test("tslotnut resolves M6 14x20x8mm stepped T-slot nut", () => {
  const parsed = parseModelString(
    "tslotnut_m6_w14mm_l20mm_h8mm_topw8mm_toph4mm_flatends_through",
  )
  expect(parsed).toEqual({
    fn: "tslotnut",
    threadDiameter: 6,
    width: 14,
    length: 20,
    height: 8,
    topWidth: 8,
    topHeight: 4,
    endStyle: "flatends",
    boreStyle: "through",
  })
  expect(getTSlotNutDimensions().flangeHeight).toBe(4)
})

test("tslotnut supports M5 rounded-end blind variant and roundtrips", () => {
  const parsed = parseModelString("tslotnut_m5_roundedends_blind")
  expect(parsed.fn).toBe("tslotnut")
  if (parsed.fn !== "tslotnut") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(tSlotNutModelPropsSchema.parse({}).threadDiameter).toBe(6)
})

test("tslotnut rejects oversized thread bores and legacy selectors", () => {
  expect(() => parseModelString("tslotnut_ends(flat)")).toThrow()
  expect(() => parseModelString("tslotnut_m8_topw8mm")).toThrow()
})
