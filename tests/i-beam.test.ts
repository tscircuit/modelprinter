import { expect, test } from "bun:test"
import {
  getIBeamDimensions,
  iBeamModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("ibeam resolves IPE80 80x46mm structural steel beam", () => {
  const parsed = parseModelString(
    "ibeam_h80mm_w46mm_web3.8mm_flange5.2mm_rootr5mm_l300mm_ipe80_en10365",
  )
  expect(parsed).toEqual({
    fn: "ibeam",
    height: 80,
    width: 46,
    webThickness: 3.8,
    flangeThickness: 5.2,
    rootRadius: 5,
    length: 300,
    ipe80: true,
    en10365: true,
  })
  expect(getIBeamDimensions().straightWebHeight).toBeCloseTo(59.6, 6)
})

test("ibeam supports 500mm span and roundtrips", () => {
  const parsed = parseModelString("ibeam_h100mm_w55mm_l500mm")
  expect(parsed.fn).toBe("ibeam")
  if (parsed.fn !== "ibeam") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(iBeamModelPropsSchema.parse({}).rootRadius).toBe(5)
})

test("ibeam rejects legacy selectors and oversized flanges", () => {
  expect(() => parseModelString("ibeam_section(ipe80)")).toThrow()
  expect(() => parseModelString("ibeam_h40mm_flange18mm")).toThrow()
})
