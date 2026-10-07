import { expect, test } from "bun:test"
import {
  mp,
  linearRailModelPropsSchema,
  linearRailModelDefinitionSchema,
} from "../src"
test("rail rejects malformed, duplicate and incompatible mounting patterns", () => {
  for (const text of [
    "linearrail12",
    "linearrail_w12mm_width12mm",
    "linearrail_w12mmjunk",
    "linearrail_holes4mm",
    "linearrail_profile(any)",
    "linearrail_l90mm",
    "linearrail_pitch6mm",
    "linearrail_cbored4mm",
    "linearrail_cbore0mm",
    "linearrail_neckw12mm",
    "linearrail_chamfer4mm",
  ])
    expect(() => mp.string(text).json()).toThrow()
  for (const value of [
    { holeCount: 0 },
    { holeCount: 513 },
    { holeCount: 1.5 },
    { length: Infinity },
    { baseHeight: 6 },
    { holeDiameter: 8 },
    { counterboreDiameter: 11.5 },
    { holePitch: 1e308, holeCount: 3 },
    { unknown: 1 },
  ])
    expect(linearRailModelPropsSchema.safeParse(value).success).toBe(false)
  expect(
    linearRailModelDefinitionSchema.safeParse({ fn: "linearcarriage" }).success,
  ).toBe(false)
})
