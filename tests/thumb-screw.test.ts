import { expect, test } from "bun:test"
import {
  getThumbScrewDimensions,
  modelDefinitionSchema,
  parseModelString,
  thumbScrewModelPropsSchema,
} from "../src"

test("thumbscrew resolves M4x12mm straight-knurled hand screw", () => {
  const parsed = parseModelString(
    "thumbscrew_custom_m4_l12mm_headod12mm_headh6mm_straightknurl_knurlp1mm_fullthread_chamfertip",
  )
  expect(parsed).toEqual({
    fn: "thumbscrew",
    custom: true,
    thread: "m4",
    length: 12,
    headOuterDiameter: 12,
    headHeight: 6,
    straightKnurl: true,
    knurlPitch: 1,
    fullThread: true,
    chamferTip: true,
  })

  const dims = getThumbScrewDimensions()
  expect(dims.majorDiameter).toBe(4)
  expect(dims.overallLength).toBe(18)
  expect(dims.knurlRidgeCount).toBe(38)
})

test("thumbscrew supports M5x20mm variant and schema roundtrip", () => {
  const parsed = parseModelString("thumbscrew_M5_l2cm_headod16mm")
  expect(parsed.fn).toBe("thumbscrew")
  if (parsed.fn !== "thumbscrew") return
  expect(parsed.thread).toBe("m5")
  expect(parsed.length).toBeCloseTo(20)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(thumbScrewModelPropsSchema.parse({}).straightKnurl).toBe(true)
})

test("thumbscrew rejects legacy selectors and undersized thumb heads", () => {
  expect(() =>
    parseModelString("thumbscrew_spec(custom)_knurl(straight)_thread(full)"),
  ).toThrow()
  expect(() => parseModelString("thumbscrew_m6_headod7mm")).toThrow()
})
