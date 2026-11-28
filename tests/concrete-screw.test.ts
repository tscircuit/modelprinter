import { expect, test } from "bun:test"
import {
  concreteScrewModelPropsSchema,
  getConcreteScrewDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("concretescrew resolves 6x50mm Hi-Lo hex-flange masonry screw", () => {
  const parsed = parseModelString(
    "concretescrew_custom_d6mm_core4mm_l50mm_threadpitch2mm_righthanded_hilothread_lowd5mm_hexflange_af8mm_flangeod11mm_headh4mm_notchedconetip_cuts2_cutl5mm",
  )
  expect(parsed).toEqual({
    fn: "concretescrew",
    custom: true,
    diameter: 6,
    coreDiameter: 4,
    length: 50,
    threadPitch: 2,
    rightHanded: true,
    hiLoThread: true,
    lowCrestDiameter: 5,
    hexFlange: true,
    acrossFlats: 8,
    flangeOuterDiameter: 11,
    headHeight: 4,
    notchedConeTip: true,
    cuts: 2,
    cutLength: 5,
  })

  const dims = getConcreteScrewDimensions()
  expect(dims.overallLength).toBe(54)
  expect(dims.bottomZ).toBe(-50)
})

test("concretescrew supports 7.5x75mm variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "concretescrew_d7.5mm_core5.2mm_lowd6.4mm_l7.5cm_af10mm_flangeod14mm",
  )
  expect(parsed.fn).toBe("concretescrew")
  if (parsed.fn !== "concretescrew") return
  expect(parsed.length).toBeCloseTo(75)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(concreteScrewModelPropsSchema.parse({}).hiLoThread).toBe(true)
})

test("concretescrew rejects legacy selectors and invalid Hi-Lo crest ordering", () => {
  expect(() =>
    parseModelString("concretescrew_spec(custom)_thread(hilo)"),
  ).toThrow()
  expect(() =>
    parseModelString("concretescrew_d6mm_core4mm_lowd6.5mm"),
  ).toThrow()
})
