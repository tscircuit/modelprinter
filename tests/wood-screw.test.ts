import { expect, test } from "bun:test"
import {
  getWoodScrewDimensions,
  modelDefinitionSchema,
  parseModelString,
  woodScrewModelPropsSchema,
} from "../src"

test("woodscrew resolves 4x25mm 90-deg countersunk wood screw", () => {
  const parsed = parseModelString(
    "woodscrew_custom_d4mm_core2.5mm_l25mm_threadl18mm_threadpitch2mm_righthanded_countersunk_headod8mm_headangle90deg_phillips_conetip",
  )
  expect(parsed).toEqual({
    fn: "woodscrew",
    custom: true,
    diameter: 4,
    coreDiameter: 2.5,
    length: 25,
    threadLength: 18,
    threadPitch: 2,
    rightHanded: true,
    countersunk: true,
    headOuterDiameter: 8,
    headAngle: 90,
    phillips: true,
    coneTip: true,
  })

  const dims = getWoodScrewDimensions()
  expect(dims.headHeight).toBeCloseTo(2)
  expect(dims.unthreadedShankLength).toBeCloseTo(5)
  expect(dims.bottomZ).toBe(-25)
})

test("woodscrew supports 5x40mm left-handed variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "woodscrew_d5mm_core3.2mm_l4cm_threadl26mm_headod10mm_lefthanded",
  )
  expect(parsed.fn).toBe("woodscrew")
  if (parsed.fn !== "woodscrew") return
  expect(parsed.length).toBeCloseTo(40)
  expect(parsed.rightHanded).toBe(false)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(woodScrewModelPropsSchema.parse({}).phillips).toBe(true)
})

test("woodscrew rejects legacy selectors and overlapping thread/head lengths", () => {
  expect(() =>
    parseModelString(
      "woodscrew_spec(custom)_head(countersunk)_drive(phillips)",
    ),
  ).toThrow()
  expect(() =>
    parseModelString("woodscrew_d4mm_headod8mm_l20mm_threadl19mm"),
  ).toThrow()
})
