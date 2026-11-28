import { expect, test } from "bun:test"
import {
  getSteppedShaftDimensions,
  modelDefinitionSchema,
  parseModelString,
  steppedShaftModelPropsSchema,
} from "../src"

test("steppedshaft resolves 20/12mm stepped journal shaft", () => {
  const parsed = parseModelString(
    "steppedshaft_d20mm_endd12mm_l150mm_endl25mm_shoulderfillet1mm_endchamfer1mm",
  )
  expect(parsed).toEqual({
    fn: "steppedshaft",
    diameter: 20,
    endDiameter: 12,
    length: 150,
    endLength: 25,
    shoulderFillet: 1,
    endChamfer: 1,
  })

  const dims = getSteppedShaftDimensions()
  expect(dims.centerLength).toBe(100)
  expect(dims.shoulderStepHeight).toBe(4)
})

test("steppedshaft supports 16/10mm variant and schema roundtrip", () => {
  const parsed = parseModelString("steppedshaft_d16mm_endd10mm_l120mm_endl20mm")
  expect(parsed.fn).toBe("steppedshaft")
  if (parsed.fn !== "steppedshaft") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(steppedShaftModelPropsSchema.parse({}).diameter).toBe(20)
})

test("steppedshaft rejects oversized journals and overflowing fillets", () => {
  expect(() => parseModelString("steppedshaft_d20mm_endd20mm")).toThrow()
  expect(() =>
    parseModelString("steppedshaft_d20mm_endd12mm_shoulderfillet5mm"),
  ).toThrow()
})
