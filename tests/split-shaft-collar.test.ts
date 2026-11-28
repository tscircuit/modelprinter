import { expect, test } from "bun:test"
import {
  getSplitShaftCollarDimensions,
  modelDefinitionSchema,
  parseModelString,
  splitShaftCollarModelPropsSchema,
} from "../src"

test("splitshaftcollar resolves 20x40x12mm two-piece clamp collar", () => {
  const parsed = parseModelString(
    "splitshaftcollar_bore20mm_od40mm_w12mm_twopiececlamp_bolts2_m5",
  )
  expect(parsed).toEqual({
    fn: "splitshaftcollar",
    boreDiameter: 20,
    outerDiameter: 40,
    width: 12,
    twoPieceClamp: true,
    bolts: 2,
    thread: "m5",
  })

  const dims = getSplitShaftCollarDimensions()
  expect(dims.radialWallThickness).toBe(10)
  expect(dims.boltMajorDiameter).toBe(5)
})

test("splitshaftcollar supports 12mm M4 variant and schema roundtrip", () => {
  const parsed = parseModelString("splitshaftcollar_bore12mm_od28mm_w11mm_M4")
  expect(parsed.fn).toBe("splitshaftcollar")
  if (parsed.fn !== "splitshaftcollar") return
  expect(parsed.thread).toBe("m4")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(splitShaftCollarModelPropsSchema.parse({}).twoPieceClamp).toBe(true)
})

test("splitshaftcollar rejects legacy mount(...) selectors and thin walls", () => {
  expect(() =>
    parseModelString("splitshaftcollar_mount(twopiececlamp)"),
  ).toThrow()
  expect(() =>
    parseModelString("splitshaftcollar_bore20mm_od28mm_m5"),
  ).toThrow()
})
