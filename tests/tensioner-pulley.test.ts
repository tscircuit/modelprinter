import { expect, test } from "bun:test"
import {
  getTensionerPulleyDimensions,
  modelDefinitionSchema,
  parseModelString,
  tensionerPulleyModelPropsSchema,
} from "../src"

test("tensionerpulley resolves 40x15mm idler on 60mm pivot arm", () => {
  const parsed = parseModelString(
    "tensionerpulley_od40mm_w15mm_arml60mm_pivotd8mm_bearingbore8mm_springhole5mm_pivotbore",
  )
  expect(parsed).toEqual({
    fn: "tensionerpulley",
    outerDiameter: 40,
    width: 15,
    armLength: 60,
    pivotDiameter: 8,
    bearingBore: 8,
    springHoleDiameter: 5,
    pivotBore: true,
  })
  expect(getTensionerPulleyDimensions().pivotToRimClearance).toBe(36)
})

test("tensionerpulley supports 80mm long-arm tensioner and roundtrips", () => {
  const parsed = parseModelString("tensionerpulley_od50mm_arml80mm")
  expect(parsed.fn).toBe("tensionerpulley")
  if (parsed.fn !== "tensionerpulley") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(tensionerPulleyModelPropsSchema.parse({}).pivotDiameter).toBe(8)
})

test("tensionerpulley rejects legacy selectors and colliding arms", () => {
  expect(() => parseModelString("tensionerpulley_mount(pivotbore)")).toThrow()
  expect(() => parseModelString("tensionerpulley_od40mm_arml22mm")).toThrow()
})
