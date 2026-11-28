import { expect, test } from "bun:test"
import {
  getToroidalCoreDimensions,
  modelDefinitionSchema,
  parseModelString,
  toroidalCoreModelPropsSchema,
} from "../src"

test("toroidalcore resolves 30x15x10mm R2mm magnetic toroid", () => {
  const parsed = parseModelString(
    "toroidalcore_od30mm_id15mm_h10mm_edger2mm_roundedrectangle",
  )
  expect(parsed).toEqual({
    fn: "toroidalcore",
    outerDiameter: 30,
    innerDiameter: 15,
    height: 10,
    edgeRadius: 2,
    roundedRectangle: true,
  })
  expect(getToroidalCoreDimensions().radialCrossSectionWidth).toBe(7.5)
})

test("toroidalcore supports 50mm toroid variant and schema roundtrip", () => {
  const parsed = parseModelString("toroidalcore_od50mm_id30mm_h20mm")
  expect(parsed.fn).toBe("toroidalcore")
  if (parsed.fn !== "toroidalcore") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(toroidalCoreModelPropsSchema.parse({}).roundedRectangle).toBe(true)
})

test("toroidalcore rejects legacy selectors and oversized edge radii", () => {
  expect(() =>
    parseModelString("toroidalcore_profile(roundedrectangle)"),
  ).toThrow()
  expect(() => parseModelString("toroidalcore_h10mm_edger5.5mm")).toThrow()
})
