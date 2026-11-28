import { expect, test } from "bun:test"
import {
  getTerminalCoverDimensions,
  modelDefinitionSchema,
  parseModelString,
  terminalCoverModelPropsSchema,
} from "../src"

test("terminalcover resolves 70x35x20mm U-hood terminal cover", () => {
  const parsed = parseModelString(
    "terminalcover_w70mm_d35mm_h20mm_t2mm_uhood_feet5mm_holes2_hole3mm_hp60mm",
  )
  expect(parsed).toEqual({
    fn: "terminalcover",
    width: 70,
    depth: 35,
    height: 20,
    thickness: 2,
    uHood: true,
    footWidth: 5,
    holes: 2,
    holeDiameter: 3,
    holePitch: 60,
  })

  const dims = getTerminalCoverDimensions()
  expect(dims.overallDepthWithFeet).toBe(45)
  expect(dims.innerClearHeight).toBe(18)
})

test("terminalcover supports 100mm cover and schema roundtrip", () => {
  const parsed = parseModelString("terminalcover_w100mm_hp88mm")
  expect(parsed.fn).toBe("terminalcover")
  if (parsed.fn !== "terminalcover") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(terminalCoverModelPropsSchema.parse({}).uHood).toBe(true)
})

test("terminalcover rejects legacy shape(...) selectors and overflowing hole pitch", () => {
  expect(() => parseModelString("terminalcover_shape(uhood)")).toThrow()
  expect(() => parseModelString("terminalcover_w70mm_hp68mm_hole3mm")).toThrow()
})
