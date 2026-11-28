import { expect, test } from "bun:test"
import {
  flangedBallBearingModelPropsSchema,
  getFlangedBallBearingDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("flangedballbearing resolves F608 8x22x7mm flanged radial bearing", () => {
  const parsed = parseModelString(
    "flangedballbearing_id8mm_od22mm_w7mm_flangeod25mm_rows1_flangethickness1.5mm_open",
  )
  expect(parsed).toEqual({
    fn: "flangedballbearing",
    innerDiameter: 8,
    outerDiameter: 22,
    width: 7,
    flangeOuterDiameter: 25,
    rows: 1,
    flangeThickness: 1.5,
    closure: "open",
  })
  expect(getFlangedBallBearingDimensions().pilotLength).toBe(5.5)
})

test("flangedballbearing supports shielded F625 variant and roundtrips", () => {
  const parsed = parseModelString(
    "flangedballbearing_id5mm_od16mm_w5mm_flangeod18mm_flangethickness1mm_shielded",
  )
  expect(parsed.fn).toBe("flangedballbearing")
  if (parsed.fn !== "flangedballbearing") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(flangedBallBearingModelPropsSchema.parse({}).flangeOuterDiameter).toBe(
    25,
  )
})

test("flangedballbearing rejects non-projecting flanges and legacy selectors", () => {
  expect(() => parseModelString("flangedballbearing_series(f608)")).toThrow()
  expect(() =>
    parseModelString("flangedballbearing_od22mm_flangeod22mm"),
  ).toThrow()
})
