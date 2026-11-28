import { expect, test } from "bun:test"
import {
  getShelfPostDimensions,
  modelDefinitionSchema,
  parseModelString,
  shelfPostModelPropsSchema,
} from "../src"

test("shelfpost resolves 25x600mm 25mm-pitch grooved shelving post", () => {
  const parsed = parseModelString(
    "shelfpost_od25mm_wall1.5mm_l600mm_groovepitch25mm_groovew2mm_grooved1mm_firstgroove25mm",
  )
  expect(parsed).toEqual({
    fn: "shelfpost",
    outerDiameter: 25,
    wallThickness: 1.5,
    length: 600,
    groovePitch: 25,
    grooveWidth: 2,
    grooveDepth: 1,
    firstGrooveZ: 25,
  })
  expect(getShelfPostDimensions().grooveCount).toBe(23)
})

test("shelfpost supports 1200mm tall post and schema roundtrip", () => {
  const parsed = parseModelString("shelfpost_l1200mm_wall2mm")
  expect(parsed.fn).toBe("shelfpost")
  if (parsed.fn !== "shelfpost") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(shelfPostModelPropsSchema.parse({}).groovePitch).toBe(25)
})

test("shelfpost rejects wall-piercing groove depths and parenthesized tokens", () => {
  expect(() => parseModelString("shelfpost_cap(plastic)")).toThrow()
  expect(() => parseModelString("shelfpost_wall1.5mm_grooved1.5mm")).toThrow()
})
