import { expect, test } from "bun:test"
import {
  getToggleControlDimensions,
  modelDefinitionSchema,
  parseModelString,
  toggleControlModelPropsSchema,
} from "../src"

test("togglecontrol resolves M6 miniature toggle switch body, bushing and lever reach", () => {
  const parsed = parseModelString(
    "togglecontrol_body(12mm,8mm,10mm)_m6_threadpitch0.75mm_bushingl6mm_leverl15mm_contacts3_solderlug_verticallever",
  )
  expect(parsed).toEqual({
    fn: "togglecontrol",
    bodyLength: 12,
    bodyWidth: 8,
    bodyHeight: 10,
    thread: "m6",
    threadPitch: 0.75,
    bushingLength: 6,
    leverLength: 15,
    contacts: 3,
    solderLug: true,
    verticalLever: true,
  })

  const dims = getToggleControlDimensions()
  expect(dims.bushingNominalDiameter).toBe(6)
  expect(dims.bushingTopZ).toBe(6)
  expect(dims.leverTipZ).toBe(21)
  expect(dims.lugTipZ).toBe(-14)
})

test("togglecontrol supports DPDT contacts6, split body tokens and schema roundtrip", () => {
  const parsed = parseModelString(
    "togglecontrol_bodyl13mm_bodyw13mm_bodyh10mm_M6_contacts6",
  )
  expect(parsed.fn).toBe("togglecontrol")
  if (parsed.fn !== "togglecontrol") return
  expect(parsed.contacts).toBe(6)
  expect(parsed.thread).toBe("m6")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(toggleControlModelPropsSchema.parse({}).solderLug).toBe(true)
})

test("togglecontrol rejects legacy selectors, oversized bushings and invalid contacts", () => {
  expect(() =>
    parseModelString(
      "togglecontrol_body(12mm,8mm,10mm)_m6_tail(solderlug)_leveraxis(vertical)",
    ),
  ).toThrow()
  expect(() =>
    parseModelString("togglecontrol_body(12mm,8mm,10mm)_m10"),
  ).toThrow()
  expect(() => parseModelString("togglecontrol_contacts5")).toThrow()
})
