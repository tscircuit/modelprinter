import { expect, test } from "bun:test"
import {
  getXRingDimensions,
  modelDefinitionSchema,
  parseModelString,
  xRingModelPropsSchema,
} from "../src"

test("xring resolves 20mm ID x 2mm CSD four-lobed quad ring", () => {
  const parsed = parseModelString(
    "xring_id20mm_csd2mm_quadrilobe_lobes4_lober0.6mm",
  )
  expect(parsed).toEqual({
    fn: "xring",
    innerDiameter: 20,
    crossSectionDiameter: 2,
    quadrilobe: true,
    lobes: 4,
    lobeRadius: 0.6,
  })
  expect(getXRingDimensions().outerDiameter).toBe(24)
})

test("xring supports 3.53mm CSD variant and schema roundtrip", () => {
  const parsed = parseModelString("xring_id35mm_csd3.53mm_lober1mm")
  expect(parsed.fn).toBe("xring")
  if (parsed.fn !== "xring") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(xRingModelPropsSchema.parse({}).quadrilobe).toBe(true)
})

test("xring rejects legacy selectors and oversized lobe radii", () => {
  expect(() => parseModelString("xring_profile(quadrilobe)")).toThrow()
  expect(() => parseModelString("xring_csd2mm_lober1.2mm")).toThrow()
})
