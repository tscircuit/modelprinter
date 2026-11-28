import { expect, test } from "bun:test"
import {
  getMicroswitchDimensions,
  microswitchModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("microswitch resolves 20x10x6mm 3-contact lever snap switch", () => {
  const parsed = parseModelString(
    "microswitch_w20mm_h10mm_d6mm_leverl25mm_t0.5mm_holes2_hole2mm_hp9.5mm_contacts3_solderlug",
  )
  expect(parsed).toEqual({
    fn: "microswitch",
    width: 20,
    height: 10,
    depth: 6,
    leverLength: 25,
    leverThickness: 0.5,
    holes: 2,
    holeDiameter: 2,
    holePitch: 9.5,
    contacts: 3,
    solderLug: true,
  })
  expect(getMicroswitchDimensions().overallSpanX).toBe(25)
})

test("microswitch supports 2-contact SPST variant and schema roundtrip", () => {
  const parsed = parseModelString("microswitch_contacts2_leverl18mm")
  expect(parsed.fn).toBe("microswitch")
  if (parsed.fn !== "microswitch") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(microswitchModelPropsSchema.parse({}).solderLug).toBe(true)
})

test("microswitch rejects legacy selectors and overflowing hole pitches", () => {
  expect(() => parseModelString("microswitch_tail(solderlug)")).toThrow()
  expect(() => parseModelString("microswitch_w20mm_hp19mm_hole2mm")).toThrow()
})
