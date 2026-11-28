import { expect, test } from "bun:test"
import {
  getSpringPlungerDimensions,
  modelDefinitionSchema,
  parseModelString,
  springPlungerModelPropsSchema,
} from "../src"

test("springplunger resolves M6x20mm 3mm-pin extended spring plunger", () => {
  const parsed = parseModelString(
    "springplunger_custom_m6_l20mm_pind3mm_projection4mm_stroke4mm_roundtip_slottedrear_slotw1mm_slotdepth1mm_extended",
  )
  expect(parsed).toEqual({
    fn: "springplunger",
    custom: true,
    thread: "m6",
    length: 20,
    pinDiameter: 3,
    projection: 4,
    stroke: 4,
    roundTip: true,
    slottedRear: true,
    slotWidth: 1,
    slotDepth: 1,
    extended: true,
  })

  const dims = getSpringPlungerDimensions()
  expect(dims.overallLength).toBe(24)
  expect(dims.majorDiameter).toBe(6)
})

test("springplunger supports M8x25mm variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "springplunger_M8_l25mm_pind4mm_projection5mm_stroke5mm",
  )
  expect(parsed.fn).toBe("springplunger")
  if (parsed.fn !== "springplunger") return
  expect(parsed.thread).toBe("m8")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(springPlungerModelPropsSchema.parse({}).extended).toBe(true)
})

test("springplunger rejects legacy selectors and strokes exceeding projection", () => {
  expect(() =>
    parseModelString("springplunger_tip(round)_state(extended)"),
  ).toThrow()
  expect(() =>
    parseModelString("springplunger_projection3mm_stroke5mm"),
  ).toThrow()
})
