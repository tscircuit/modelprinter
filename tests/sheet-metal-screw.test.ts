import { expect, test } from "bun:test"
import {
  getSheetMetalScrewDimensions,
  modelDefinitionSchema,
  parseModelString,
  sheetMetalScrewModelPropsSchema,
} from "../src"

test("sheetmetalscrew resolves ISO 7049 ST3.5x13 pointed pan-head screw", () => {
  const parsed = parseModelString(
    "sheetmetalscrew_iso7049_st3.5_threadpitch1.3mm_righthanded_l13mm_typec_phillips",
  )
  expect(parsed).toEqual({
    fn: "sheetmetalscrew",
    iso7049: true,
    tappingSize: "st3.5",
    threadPitch: 1.3,
    rightHanded: true,
    length: 13,
    typeC: true,
    phillips: true,
  })

  const dims = getSheetMetalScrewDimensions({
    tappingSize: "st3.5",
    length: 13,
  })
  expect(dims.headDiameter).toBeCloseTo(7.0)
  expect(dims.headHeight).toBeCloseTo(2.6)
  expect(dims.overallLength).toBeCloseTo(15.6)
})

test("sheetmetalscrew resolves default pitch from ST4.2 table and roundtrips", () => {
  const parsed = parseModelString("sheetmetalscrew_ST4.2_l16mm")
  expect(parsed.fn).toBe("sheetmetalscrew")
  if (parsed.fn !== "sheetmetalscrew") return
  expect(parsed.tappingSize).toBe("st4.2")
  expect(parsed.threadPitch).toBeCloseTo(1.4)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(
    sheetMetalScrewModelPropsSchema.parse({ tappingSize: "st4.8", length: 19 })
      .threadPitch,
  ).toBeCloseTo(1.6)
})

test("sheetmetalscrew rejects legacy selectors and contradictory pitches", () => {
  expect(() =>
    parseModelString("sheetmetalscrew_standard(iso7049)_st3.5_l13mm"),
  ).toThrow()
  expect(() =>
    parseModelString("sheetmetalscrew_st3.5_threadpitch2mm_l13mm"),
  ).toThrow()
})
