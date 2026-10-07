import { expect, test } from "bun:test"
import {
  mp,
  linearCarriageModelPropsSchema,
  linearCarriageModelDefinitionSchema,
} from "../src"
test("carriage rejects conflicting widths, lips, blind-hole depths and parser tokens", () => {
  for (const text of [
    "linearcarriage12",
    "linearcarriage_railw12mm_railwidth12mm",
    "linearcarriage_holedepth4mmjunk",
    "linearcarriage_holes3",
    "linearcarriage_clearance0mm",
    "linearcarriage_holedepth5mm",
    "linearcarriage_neckw12mm",
    "linearcarriage_clearance1mm",
    "linearcarriage_holex25mm",
    "linearcarriage_profile(any)",
  ])
    expect(() => mp.string(text).json()).toThrow()
  for (const value of [
    { width: 12.3 },
    { height: 8.15 },
    { railHeight: 3 },
    { holePitchY: 45 },
    { holeDepth: Infinity },
    { clearance: 1e-300 },
    { railBaseHeight: Number.MAX_VALUE },
    { unknown: 1 },
  ])
    expect(linearCarriageModelPropsSchema.safeParse(value).success).toBe(false)
  expect(
    linearCarriageModelDefinitionSchema.safeParse({ fn: "linearrail" }).success,
  ).toBe(false)
})
