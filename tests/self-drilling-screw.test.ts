import { expect, test } from "bun:test"
import {
  getSelfDrillingScrewDimensions,
  modelDefinitionSchema,
  parseModelString,
  selfDrillingScrewModelPropsSchema,
} from "../src"

test("selfdrillingscrew resolves 4.2x19mm hex-flange 2-flute screw", () => {
  const parsed = parseModelString(
    "selfdrillingscrew_custom_d4.2mm_core3.1mm_threadpitch1.4mm_righthanded_l19mm_threadl14mm_hexflange_af7mm_headh4mm_flangeod9.5mm_drilll5mm_flutes2_pointangle118deg",
  )
  expect(parsed).toEqual({
    fn: "selfdrillingscrew",
    custom: true,
    diameter: 4.2,
    coreDiameter: 3.1,
    threadPitch: 1.4,
    rightHanded: true,
    length: 19,
    threadLength: 14,
    hexFlange: true,
    acrossFlats: 7,
    headHeight: 4,
    flangeOuterDiameter: 9.5,
    drillLength: 5,
    flutes: 2,
    pointAngle: 118,
  })

  const dims = getSelfDrillingScrewDimensions()
  expect(dims.overallLength).toBe(23)
  expect(dims.unthreadedUnderHeadRelief).toBe(0)
  expect(dims.bottomZ).toBe(-19)
})

test("selfdrillingscrew supports 25mm longer shank and schema roundtrip", () => {
  const parsed = parseModelString(
    "selfdrillingscrew_l25mm_threadl16mm_drilll6mm",
  )
  expect(parsed.fn).toBe("selfdrillingscrew")
  if (parsed.fn !== "selfdrillingscrew") return
  expect(parsed.length).toBe(25)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(selfDrillingScrewModelPropsSchema.parse({}).hexFlange).toBe(true)
})

test("selfdrillingscrew rejects legacy selectors and overflowing thread+drill lengths", () => {
  expect(() =>
    parseModelString("selfdrillingscrew_spec(custom)_head(hexflange)"),
  ).toThrow()
  expect(() =>
    parseModelString("selfdrillingscrew_l19mm_threadl15mm_drilll6mm"),
  ).toThrow()
})
