import { expect, test } from "bun:test"
import {
  ballScrewModelPropsSchema,
  getBallScrewDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("ballscrew resolves 16x400mm 5mm-pitch Gothic-arch ball screw", () => {
  const parsed = parseModelString(
    "ballscrew_d16mm_l400mm_pitch5mm_gothicarch_righthand_starts1_endjournald12mm_endjournall30mm",
  )
  expect(parsed).toEqual({
    fn: "ballscrew",
    diameter: 16,
    length: 400,
    pitch: 5,
    gothicArch: true,
    handedness: "right",
    starts: 1,
    endJournalDiameter: 12,
    endJournalLength: 30,
  })

  const dims = getBallScrewDimensions()
  expect(dims.lead).toBe(5)
  expect(dims.threadedLength).toBe(340)
  expect(dims.topZ).toBe(400)
})

test("ballscrew supports 2-start left-hand SFU2010 variant and roundtrips", () => {
  const parsed = parseModelString(
    "ballscrew_d20mm_l500mm_pitch5mm_lefthand_starts2_endjournald15mm",
  )
  expect(parsed.fn).toBe("ballscrew")
  if (parsed.fn !== "ballscrew") return
  expect(parsed.handedness).toBe("left")
  const { fn: _, ...propsOnly } = parsed
  expect(getBallScrewDimensions(propsOnly).lead).toBe(10)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(ballScrewModelPropsSchema.parse({}).gothicArch).toBe(true)
})

test("ballscrew rejects legacy selectors and unreduced end journals", () => {
  expect(() =>
    parseModelString("ballscrew_profile(gothicarch)_hand(right)"),
  ).toThrow()
  expect(() => parseModelString("ballscrew_d16mm_endjournald16mm")).toThrow()
})
