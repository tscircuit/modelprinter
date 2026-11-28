import { expect, test } from "bun:test"
import {
  ballStudModelPropsSchema,
  getBallStudDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("ballstud resolves M6x15mm 10mm-ball linkage stud", () => {
  const parsed = parseModelString(
    "ballstud_custom_m6_l15mm_balld10mm_neckd5mm_neckl4mm_shoulderaf10mm_shoulderh3mm_fullthread",
  )
  expect(parsed).toEqual({
    fn: "ballstud",
    custom: true,
    thread: "m6",
    threadLength: 15,
    ballDiameter: 10,
    neckDiameter: 5,
    neckLength: 4,
    shoulderAcrossFlats: 10,
    shoulderHeight: 3,
    fullThread: true,
  })

  const dims = getBallStudDimensions()
  expect(dims.ballCenterZ).toBe(12)
  expect(dims.overallLength).toBe(32)
})

test("ballstud supports M8 13mm-ball stud and schema roundtrip", () => {
  const parsed = parseModelString(
    "ballstud_M8_balld13mm_neckd7mm_shoulderaf13mm",
  )
  expect(parsed.fn).toBe("ballstud")
  if (parsed.fn !== "ballstud") return
  expect(parsed.thread).toBe("m8")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(ballStudModelPropsSchema.parse({}).fullThread).toBe(true)
})

test("ballstud rejects legacy selectors and oversized necks", () => {
  expect(() => parseModelString("ballstud_spec(custom)_thread(full)")).toThrow()
  expect(() => parseModelString("ballstud_balld10mm_neckd10mm")).toThrow()
})
