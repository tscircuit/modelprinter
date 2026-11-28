import { expect, test } from "bun:test"
import {
  getTerminalJumperDimensions,
  modelDefinitionSchema,
  parseModelString,
  terminalJumperModelPropsSchema,
} from "../src"

test("terminaljumper resolves 4-pole 5mm-pitch comb jumper", () => {
  const parsed = parseModelString(
    "terminaljumper_p5mm_n4_t1mm_stripw4mm_prongw2mm_prongl8mm_comb",
  )
  expect(parsed).toEqual({
    fn: "terminaljumper",
    pitch: 5,
    poles: 4,
    thickness: 1,
    stripWidth: 4,
    prongWidth: 2,
    prongLength: 8,
    comb: true,
  })
  expect(getTerminalJumperDimensions().overallLength).toBe(17)
})

test("terminaljumper supports 10-pole variant and schema roundtrip", () => {
  const parsed = parseModelString("terminaljumper_p6mm_n10")
  expect(parsed.fn).toBe("terminaljumper")
  if (parsed.fn !== "terminaljumper") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(terminalJumperModelPropsSchema.parse({}).comb).toBe(true)
})

test("terminaljumper rejects legacy selectors and touching prongs", () => {
  expect(() => parseModelString("terminaljumper_shape(comb)")).toThrow()
  expect(() => parseModelString("terminaljumper_p5mm_prongw4.8mm")).toThrow()
})
