import { expect, test } from "bun:test"
import {
  getThreadRollingScrewDimensions,
  modelDefinitionSchema,
  parseModelString,
  threadRollingScrewModelPropsSchema,
} from "../src"

test("threadrollingscrew resolves M4x16mm trilobular thread-forming screw", () => {
  const parsed = parseModelString(
    "threadrollingscrew_custom_m4_l16mm_panhead_headod7mm_headh2.6mm_phillips_trilobular_lobes3_lobing0.25mm_lead2mm_tapertip",
  )
  expect(parsed).toEqual({
    fn: "threadrollingscrew",
    custom: true,
    thread: "m4",
    length: 16,
    panHead: true,
    headOuterDiameter: 7,
    headHeight: 2.6,
    phillips: true,
    trilobular: true,
    lobes: 3,
    lobingOffset: 0.25,
    leadLength: 2,
    taperTip: true,
  })
  expect(getThreadRollingScrewDimensions().inscribedCircleDiameter).toBe(3.5)
})

test("threadrollingscrew supports M5x20mm variant and schema roundtrip", () => {
  const parsed = parseModelString("threadrollingscrew_M5_l20mm_headod9mm")
  expect(parsed.fn).toBe("threadrollingscrew")
  if (parsed.fn !== "threadrollingscrew") return
  expect(parsed.thread).toBe("m5")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(threadRollingScrewModelPropsSchema.parse({}).trilobular).toBe(true)
})

test("threadrollingscrew rejects legacy selectors and excessive lobing", () => {
  expect(() =>
    parseModelString("threadrollingscrew_section(trilobular)_tip(taper)"),
  ).toThrow()
  expect(() => parseModelString("threadrollingscrew_m4_lobing1mm")).toThrow()
})
