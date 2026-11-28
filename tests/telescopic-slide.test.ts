import { expect, test } from "bun:test"
import {
  getTelescopicSlideDimensions,
  modelDefinitionSchema,
  parseModelString,
  telescopicSlideModelPropsSchema,
} from "../src"

test("telescopicslide resolves 300x40x15mm 3-stage ball-bearing slide", () => {
  const parsed = parseModelString(
    "telescopicslide_l300mm_w40mm_h15mm_stages3_sideholes_holed4mm_holepitch100mm_ballrace",
  )
  expect(parsed).toEqual({
    fn: "telescopicslide",
    length: 300,
    width: 40,
    height: 15,
    stages: 3,
    sideHoles: true,
    holeDiameter: 4,
    holePitch: 100,
    ballRace: true,
  })
  expect(getTelescopicSlideDimensions().holeCountPerRail).toBe(3)
})

test("telescopicslide supports 450mm 2-stage slide and schema roundtrip", () => {
  const parsed = parseModelString("telescopicslide_l450mm_stages2")
  expect(parsed.fn).toBe("telescopicslide")
  if (parsed.fn !== "telescopicslide") return
  expect(modelDefinitionSchema.parse(parsed)).toEqual(parsed)
  expect(telescopicSlideModelPropsSchema.parse({}).ballRace).toBe(true)
})

test("telescopicslide rejects legacy selectors and overflowing hole pitches", () => {
  expect(() =>
    parseModelString("telescopicslide_mount(sideholes)_style(ballrace)"),
  ).toThrow()
  expect(() =>
    parseModelString("telescopicslide_l100mm_holepitch120mm"),
  ).toThrow()
})
