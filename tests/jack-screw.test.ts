import { expect, test } from "bun:test"
import {
  getJackScrewDimensions,
  jackScrewModelPropsSchema,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("jackscrew resolves M8x40mm swivel-pad adjusting screw", () => {
  const parsed = parseModelString(
    "jackscrew_custom_m8_l40mm_fullthread_headaf13mm_headh5mm_padod15mm_padh4mm_balljoint_balld6mm",
  )
  expect(parsed).toEqual({
    fn: "jackscrew",
    custom: true,
    thread: "m8",
    length: 40,
    fullThread: true,
    headAcrossFlats: 13,
    headHeight: 5,
    padOuterDiameter: 15,
    padHeight: 4,
    ballJoint: true,
    ballDiameter: 6,
  })
  expect(getJackScrewDimensions().overallHeight).toBe(49)
})

test("jackscrew supports M10 variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "jackscrew_M10_l50mm_headaf17mm_padod20mm_balld8mm",
  )
  expect(parsed.fn).toBe("jackscrew")
  if (parsed.fn !== "jackscrew") return
  expect(parsed.thread).toBe("m10")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(jackScrewModelPropsSchema.parse({}).ballJoint).toBe(true)
})

test("jackscrew rejects legacy selectors and oversized swivel balls", () => {
  expect(() => parseModelString("jackscrew_thread(full)_joint(ball)")).toThrow()
  expect(() => parseModelString("jackscrew_m8_balld8mm")).toThrow()
})
