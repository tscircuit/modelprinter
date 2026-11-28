import { expect, test } from "bun:test"
import {
  getWingScrewDimensions,
  modelDefinitionSchema,
  parseModelString,
  wingScrewModelPropsSchema,
} from "../src"

test("wingscrew resolves M5x20mm twin-wing screw geometry", () => {
  const parsed = parseModelString(
    "wingscrew_custom_m5_l20mm_fullthread_twinwing_wingw28mm_wingh12mm_wingth3mm_bossod9mm",
  )
  expect(parsed).toEqual({
    fn: "wingscrew",
    custom: true,
    thread: "m5",
    length: 20,
    fullThread: true,
    twinWing: true,
    wingSpan: 28,
    wingHeight: 12,
    wingThickness: 3,
    bossOuterDiameter: 9,
  })

  const dims = getWingScrewDimensions()
  expect(dims.singleWingProjection).toBeCloseTo(9.5)
  expect(dims.overallLength).toBe(32)
  expect(dims.wingCount).toBe(2)
})

test("wingscrew supports M6x30mm variant and schema roundtrip", () => {
  const parsed = parseModelString("wingscrew_M6_l3cm_bossod11mm_wingw32mm")
  expect(parsed.fn).toBe("wingscrew")
  if (parsed.fn !== "wingscrew") return
  expect(parsed.thread).toBe("m6")
  expect(parsed.length).toBeCloseTo(30)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(wingScrewModelPropsSchema.parse({}).twinWing).toBe(true)
})

test("wingscrew rejects legacy selectors and undersized wing spans", () => {
  expect(() =>
    parseModelString("wingscrew_spec(custom)_thread(full)_head(twinwing)"),
  ).toThrow()
  expect(() => parseModelString("wingscrew_bossod12mm_wingw14mm")).toThrow()
})
