import { expect, test } from "bun:test"
import {
  getWeldStudDimensions,
  modelDefinitionSchema,
  parseModelString,
  weldStudModelPropsSchema,
} from "../src"

test("weldstud resolves M6x25mm flanged CD weld stud", () => {
  const parsed = parseModelString(
    "weldstud_custom_m6_l25mm_fullthread_baseod8mm_baseh1.5mm_weldtipd2mm_weldtipl1mm",
  )
  expect(parsed).toEqual({
    fn: "weldstud",
    custom: true,
    thread: "m6",
    length: 25,
    fullThread: true,
    baseOuterDiameter: 8,
    baseHeight: 1.5,
    weldTipDiameter: 2,
    weldTipLength: 1,
  })

  const dims = getWeldStudDimensions()
  expect(dims.preWeldOverallHeight).toBeCloseTo(27.5)
  expect(dims.topZ).toBeCloseTo(26.5)
})

test("weldstud supports M4x16mm variant and schema roundtrip", () => {
  const parsed = parseModelString("weldstud_M4_l16mm_baseod5.5mm_weldtipd1.2mm")
  expect(parsed.fn).toBe("weldstud")
  if (parsed.fn !== "weldstud") return
  expect(parsed.thread).toBe("m4")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(weldStudModelPropsSchema.parse({}).fullThread).toBe(true)
})

test("weldstud rejects legacy selectors and undersized flange collars", () => {
  expect(() => parseModelString("weldstud_spec(custom)_thread(full)")).toThrow()
  expect(() => parseModelString("weldstud_m6_baseod5mm")).toThrow()
})
