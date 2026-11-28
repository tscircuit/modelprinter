import { expect, test } from "bun:test"
import {
  getORingDimensions,
  modelDefinitionSchema,
  oRingModelPropsSchema,
  parseModelString,
} from "../src"

test("oring resolves AS568-214 toroidal sealing ring in millimeters", () => {
  const parsed = parseModelString(
    "oring_as568_size214_round_id0.984in_csd0.139in",
  )
  expect(parsed.fn).toBe("oring")
  if (parsed.fn !== "oring") return
  expect(parsed.as568).toBe(true)
  expect(parsed.round).toBe(true)
  expect(parsed.size).toBe("214")
  expect(parsed.innerDiameter).toBeCloseTo(24.9936)
  expect(parsed.crossSectionDiameter).toBeCloseTo(3.5306)

  const dims = getORingDimensions({ size: "214" })
  expect(dims.outerDiameter).toBeCloseTo(32.0548)
  expect(dims.meanDiameter).toBeCloseTo(28.5242)
})

test("oring pads 2-digit dash numbers and roundtrips through schema", () => {
  const parsed = parseModelString("oring_size6")
  expect(parsed.fn).toBe("oring")
  if (parsed.fn !== "oring") return
  expect(parsed.size).toBe("006")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(
    oRingModelPropsSchema.parse({ size: "110" }).innerDiameter,
  ).toBeCloseTo(9.1948)
})

test("oring rejects legacy parenthesized selectors and mismatched AS568 dimensions", () => {
  expect(() =>
    parseModelString("oring_standard(as568)_size214_profile(round)"),
  ).toThrow()
  expect(() => parseModelString("oring_size214_id30mm")).toThrow()
})
