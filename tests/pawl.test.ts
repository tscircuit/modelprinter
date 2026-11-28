import { expect, test } from "bun:test"
import {
  getPawlDimensions,
  modelDefinitionSchema,
  parseModelString,
  pawlModelPropsSchema,
} from "../src"

test("pawl resolves 35x12x8mm 6mm-pivot ratchet pawl", () => {
  const parsed = parseModelString(
    "pawl_l35mm_w12mm_h8mm_pivotd6mm_pivotbore_noseangle20deg_noseradius2mm",
  )
  expect(parsed).toEqual({
    fn: "pawl",
    length: 35,
    width: 12,
    height: 8,
    pivotDiameter: 6,
    pivotBore: true,
    noseAngleDeg: 20,
    noseRadius: 2,
  })
  expect(getPawlDimensions().effectiveArmLength).toBe(30)
})

test("pawl supports 50mm heavy pawl variant and schema roundtrip", () => {
  const parsed = parseModelString("pawl_l50mm_w16mm_pivotd8mm_noseangle25deg")
  expect(parsed.fn).toBe("pawl")
  if (parsed.fn !== "pawl") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(pawlModelPropsSchema.parse({}).pivotBore).toBe(true)
})

test("pawl rejects legacy selectors and oversized pivot bores", () => {
  expect(() => parseModelString("pawl_mount(pivotbore)")).toThrow()
  expect(() => parseModelString("pawl_w12mm_pivotd11mm")).toThrow()
})
