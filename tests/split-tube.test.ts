import { expect, test } from "bun:test"
import {
  getSplitTubeDimensions,
  modelDefinitionSchema,
  parseModelString,
  splitTubeModelPropsSchema,
} from "../src"

test("splittube resolves 25x2x100mm 3mm-seam open split tube", () => {
  const parsed = parseModelString(
    "splittube_od25mm_wall2mm_l100mm_gap3mm_chordgap",
  )
  expect(parsed).toEqual({
    fn: "splittube",
    outerDiameter: 25,
    wallThickness: 2,
    length: 100,
    gapWidth: 3,
    chordGap: true,
  })
  expect(getSplitTubeDimensions().innerDiameter).toBe(21)
})

test("splittube supports 40mm split sleeve and schema roundtrip", () => {
  const parsed = parseModelString("splittube_od40mm_wall3mm_gap5mm")
  expect(parsed.fn).toBe("splittube")
  if (parsed.fn !== "splittube") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(splitTubeModelPropsSchema.parse({}).chordGap).toBe(true)
})

test("splittube rejects legacy selectors and oversized seam gaps", () => {
  expect(() => parseModelString("splittube_gaptype(chord)")).toThrow()
  expect(() => parseModelString("splittube_od25mm_wall2mm_gap18mm")).toThrow()
})
