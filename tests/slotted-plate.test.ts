import { expect, test } from "bun:test"
import {
  getSlottedPlateDimensions,
  modelDefinitionSchema,
  parseModelString,
  slottedPlateModelPropsSchema,
} from "../src"

test("slottedplate resolves 200x100x2mm 10x3mm slotted sheet plate", () => {
  const parsed = parseModelString(
    "slottedplate_l200mm_w100mm_t2mm_slotl10mm_slotw3mm_pitchx15mm_pitchy10mm_edgex10mm_edgey10mm",
  )
  expect(parsed).toEqual({
    fn: "slottedplate",
    length: 200,
    width: 100,
    thickness: 2,
    slotLength: 10,
    slotWidth: 3,
    pitchX: 15,
    pitchY: 10,
    edgeX: 10,
    edgeY: 10,
  })
  expect(getSlottedPlateDimensions().columns).toBe(12)
})

test("slottedplate supports 300mm panel and roundtrips", () => {
  const parsed = parseModelString("slottedplate_l300mm_t3mm")
  expect(parsed.fn).toBe("slottedplate")
  if (parsed.fn !== "slottedplate") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(slottedPlateModelPropsSchema.parse({}).slotLength).toBe(10)
})

test("slottedplate rejects colliding slots and parenthesized tokens", () => {
  expect(() => parseModelString("slottedplate_pattern(grid)")).toThrow()
  expect(() => parseModelString("slottedplate_slotl15mm_pitchx15mm")).toThrow()
})
