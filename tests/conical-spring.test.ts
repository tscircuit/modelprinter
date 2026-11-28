import { expect, test } from "bun:test"
import {
  conicalSpringModelPropsSchema,
  getConicalSpringDimensions,
  modelDefinitionSchema,
  parseModelString,
} from "../src"

test("conicalspring resolves 15-to-8mm 8-turn tapered compression spring", () => {
  const parsed = parseModelString(
    "conicalspring_custom_od15mm_endod8mm_wire1mm_l25mm_turns8_active6_closedends_righthand_free",
  )
  expect(parsed).toEqual({
    fn: "conicalspring",
    custom: true,
    outerDiameter: 15,
    endOuterDiameter: 8,
    wireDiameter: 1,
    length: 25,
    turns: 8,
    activeTurns: 6,
    closedEnds: true,
    handedness: "right",
    freeState: true,
  })

  const dims = getConicalSpringDimensions()
  expect(dims.baseInnerDiameter).toBe(13)
  expect(dims.endInnerDiameter).toBe(6)
  expect(dims.solidHeight).toBe(8)
})

test("conicalspring supports left-hand variant and schema roundtrip", () => {
  const parsed = parseModelString(
    "conicalspring_od20mm_endod10mm_l30mm_lefthand",
  )
  expect(parsed.fn).toBe("conicalspring")
  if (parsed.fn !== "conicalspring") return
  expect(parsed.handedness).toBe("left")
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(conicalSpringModelPropsSchema.parse({}).closedEnds).toBe(true)
})

test("conicalspring rejects legacy selectors and inverted tapers", () => {
  expect(() =>
    parseModelString("conicalspring_spec(custom)_ends(closed)"),
  ).toThrow()
  expect(() => parseModelString("conicalspring_od15mm_endod16mm")).toThrow()
})
