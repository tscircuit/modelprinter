import { expect, test } from "bun:test"
import {
  getTerminalEndPlateDimensions,
  modelDefinitionSchema,
  parseModelString,
  terminalEndPlateModelPropsSchema,
} from "../src"

test("terminalendplate resolves 30x40x2mm TH35x7.5 stepped end plate", () => {
  const parsed = parseModelString(
    "terminalendplate_w30mm_h40mm_t2mm_steppedterminal_th35x7.5_pins2_pinod2mm_pinp20mm",
  )
  expect(parsed).toEqual({
    fn: "terminalendplate",
    width: 30,
    height: 40,
    thickness: 2,
    steppedTerminal: true,
    th35x75: true,
    pins: 2,
    pinOuterDiameter: 2,
    pinPitch: 20,
  })
  expect(getTerminalEndPlateDimensions().dinRailWidth).toBe(35)
})

test("terminalendplate supports 50mm tall variant and schema roundtrip", () => {
  const parsed = parseModelString("terminalendplate_w35mm_h50mm_pinp28mm")
  expect(parsed.fn).toBe("terminalendplate")
  if (parsed.fn !== "terminalendplate") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(terminalEndPlateModelPropsSchema.parse({}).steppedTerminal).toBe(true)
})

test("terminalendplate rejects legacy selectors and undersized profiles", () => {
  expect(() =>
    parseModelString("terminalendplate_shape(steppedterminal)_rail(TH35x7.5)"),
  ).toThrow()
  expect(() => parseModelString("terminalendplate_w20mm_h25mm")).toThrow()
})
