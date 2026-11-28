import { expect, test } from "bun:test"
import {
  doubleBallBearingModelPropsSchema,
  getDoubleBallBearingDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("doubleballbearing resolves 20x47x20mm 4204 double-row bearing", () => {
  const parsed = parseModelString(
    "doubleballbearing_id20mm_od47mm_w20mm_rows2_contactangle0deg_open",
  )
  expect(parsed).toEqual({
    fn: "doubleballbearing",
    innerDiameter: 20,
    outerDiameter: 47,
    width: 20,
    rows: 2,
    contactAngle: 0,
    open: true,
  })

  const dims = getDoubleBallBearingDimensions()
  expect(dims.pitchDiameter).toBeCloseTo(33.5)
  expect(dims.rowAxialSpacing).toBeCloseTo(9)
})

test("doubleballbearing supports 3205 25x52x20.6mm variant and roundtrips", () => {
  const parsed = parseModelString(
    "doubleballbearing_id25mm_od52mm_w20.6mm_contactangle30deg",
  )
  expect(parsed.fn).toBe("doubleballbearing")
  if (parsed.fn !== "doubleballbearing") return
  expect(parsed.contactAngle).toBe(30)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(doubleBallBearingModelPropsSchema.parse({}).rows).toBe(2)
})

test("doubleballbearing rejects legacy selectors and ultra-thin double rows", () => {
  expect(() => parseModelString("doubleballbearing_closure(open)")).toThrow()
  expect(() =>
    parseModelString("doubleballbearing_id20mm_od47mm_w5mm"),
  ).toThrow()
})
