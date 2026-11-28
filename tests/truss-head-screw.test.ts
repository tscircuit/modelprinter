import { expect, test } from "bun:test"
import {
  getTrussHeadScrewDimensions,
  modelDefinitionSchema,
  parseModelString,
  trussHeadScrewModelPropsSchema,
} from "../src"

test("trussheadscrew resolves M4x16mm spherical-cap truss screw", () => {
  const parsed = parseModelString(
    "trussheadscrew_custom_m4_l16mm_fullthread_headod10mm_headh2mm_sphericalcap_phillips",
  )
  expect(parsed).toEqual({
    fn: "trussheadscrew",
    custom: true,
    thread: "m4",
    length: 16,
    fullThread: true,
    headOuterDiameter: 10,
    headHeight: 2,
    sphericalCap: true,
    phillips: true,
  })

  const dims = getTrussHeadScrewDimensions()
  expect(dims.domeSphereRadius).toBeCloseTo(7.25)
  expect(dims.overallLength).toBe(18)
})

test("trussheadscrew supports M5x25mm variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "trussheadscrew_M5_l2.5cm_headod12mm_headh2.5mm",
  )
  expect(parsed.fn).toBe("trussheadscrew")
  if (parsed.fn !== "trussheadscrew") return
  expect(parsed.thread).toBe("m5")
  expect(parsed.length).toBeCloseTo(25)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(trussHeadScrewModelPropsSchema.parse({}).sphericalCap).toBe(true)
})

test("trussheadscrew rejects legacy selectors and tall non-truss domes", () => {
  expect(() =>
    parseModelString("trussheadscrew_spec(custom)_head(sphericalcap)"),
  ).toThrow()
  expect(() => parseModelString("trussheadscrew_headod10mm_headh6mm")).toThrow()
})
