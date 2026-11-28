import { expect, test } from "bun:test"
import {
  getSlottedTubeDimensions,
  modelDefinitionSchema,
  parseModelString,
  slottedTubeModelPropsSchema,
} from "../src"

test("slottedtube resolves 25x2x100mm 9x8 slotted screen tube", () => {
  const parsed = parseModelString(
    "slottedtube_od25mm_wall2mm_l100mm_slotw3mm_slotl8mm_axialpitch10mm_rows9_around8_end10mm",
  )
  expect(parsed).toEqual({
    fn: "slottedtube",
    outerDiameter: 25,
    wallThickness: 2,
    length: 100,
    slotWidth: 3,
    slotLength: 8,
    axialPitch: 10,
    rows: 9,
    around: 8,
    endMargin: 10,
  })
  expect(getSlottedTubeDimensions().totalSlots).toBe(72)
})

test("slottedtube supports 40mm 6-row variant and schema roundtrip", () => {
  const parsed = parseModelString("slottedtube_od40mm_l120mm_rows6_around10")
  expect(parsed.fn).toBe("slottedtube")
  if (parsed.fn !== "slottedtube") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(slottedTubeModelPropsSchema.parse({}).rows).toBe(9)
})

test("slottedtube rejects overflowing row spans and parenthesized tokens", () => {
  expect(() => parseModelString("slottedtube_slots(staggered)")).toThrow()
  expect(() => parseModelString("slottedtube_l50mm_rows9")).toThrow()
})
