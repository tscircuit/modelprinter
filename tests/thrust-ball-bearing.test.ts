import { expect, test } from "bun:test"
import {
  getThrustBallBearingDimensions,
  modelDefinitionSchema,
  parseModelString,
  thrustBallBearingModelPropsSchema,
} from "../src"

test("thrustballbearing resolves ISO 104 51100 washer pair and pitch circle geometry", () => {
  const parsed = parseModelString(
    "thrustballbearing_id10mm_od24mm_h9mm_series51100_flatwasherpair_rows1",
  )
  expect(parsed).toEqual({
    fn: "thrustballbearing",
    code: "51100",
    innerDiameter: 10,
    outerDiameter: 24,
    height: 9,
    flatWasherPair: true,
    rows: 1,
  })

  const dims = getThrustBallBearingDimensions({ code: "51100" })
  expect(dims.innerDiameter).toBe(10)
  expect(dims.outerDiameter).toBe(24)
  expect(dims.height).toBe(9)
  expect(dims.pitchCircleDiameter).toBeCloseTo(17)
  expect(dims.radialSectionWidth).toBeCloseTo(7)
  expect(dims.bottomZ).toBe(0)
  expect(dims.topZ).toBe(9)
})

test("thrustballbearing supports inline series shorthand, custom sizes and schema roundtrips", () => {
  const inline = parseModelString("thrustballbearing51104")
  expect(inline.fn).toBe("thrustballbearing")
  if (inline.fn !== "thrustballbearing") return
  expect(inline.innerDiameter).toBe(20)
  expect(inline.outerDiameter).toBe(35)
  expect(inline.height).toBe(10)
  expect(modelDefinitionSchema.parse(inline)).toEqual(inline)

  const custom = thrustBallBearingModelPropsSchema.parse({
    innerDiameter: "12mm",
    outerDiameter: "28mm",
    height: "9mm",
  })
  expect(custom.flatWasherPair).toBe(true)
  expect(custom.rows).toBe(1)
})

test("thrustballbearing rejects legacy selectors, mismatched series dimensions and invalid bores", () => {
  expect(() =>
    parseModelString(
      "thrustballbearing_id10mm_od24mm_h9mm_series(51100)_style(flatwasherpair)_rows1",
    ),
  ).toThrow()
  expect(() =>
    parseModelString("thrustballbearing_id12mm_od24mm_h9mm_series51100"),
  ).toThrow()
  expect(() =>
    parseModelString("thrustballbearing_id25mm_od20mm_h9mm"),
  ).toThrow()
  expect(() => parseModelString("thrustballbearing51100_rows2")).toThrow()
})
