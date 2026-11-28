import { expect, test } from "bun:test"
import {
  bellowsCouplerModelPropsSchema,
  getBellowsCouplerDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("bellowscoupler resolves 8mm-bore 25x40mm 6-fold servo coupling", () => {
  const parsed = parseModelString(
    "bellowscoupler_bore8mm_od25mm_l40mm_folds6_bellowswall0.2mm_splitclamp",
  )
  expect(parsed).toEqual({
    fn: "bellowscoupler",
    boreDiameter: 8,
    outerDiameter: 25,
    length: 40,
    folds: 6,
    bellowsWallThickness: 0.2,
    splitClamp: true,
  })
  expect(getBellowsCouplerDimensions().bellowsSpan).toBe(18)
})

test("bellowscoupler supports 12mm-bore 32x50mm coupling and roundtrips", () => {
  const parsed = parseModelString("bellowscoupler_bore12mm_od32mm_l50mm")
  expect(parsed.fn).toBe("bellowscoupler")
  if (parsed.fn !== "bellowscoupler") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(bellowsCouplerModelPropsSchema.parse({}).folds).toBe(6)
})

test("bellowscoupler rejects legacy selectors and excessive wall thicknesses", () => {
  expect(() => parseModelString("bellowscoupler_mount(splitclamp)")).toThrow()
  expect(() => parseModelString("bellowscoupler_bellowswall2mm")).toThrow()
})
