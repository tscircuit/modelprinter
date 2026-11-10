import { expect, test } from "bun:test"
import {
  ductFlangeModelPropsSchema,
  getDuctFlangeDimensions,
  modelDefinitionSchema,
  mp,
} from "../src"

const example =
  "ductflange_id150mm_od200mm_t2mm_holes8_hole6.6mm_pcd180mm_clock0deg"
const input = {
  innerDiameter: 150,
  outerDiameter: 200,
  thickness: 2,
  holeCount: 8,
  holeDiameter: 6.6,
  pitchCircleDiameter: 180,
}
const expected = { fn: "ductflange" as const, ...input, clockAngle: 0 }
const valid = (overrides: Partial<typeof input & { clockAngle: number }>) =>
  ductFlangeModelPropsSchema.safeParse({ ...input, ...overrides }).success

test("ductflange registers the model and normalizes counts, units and clock angle", () => {
  expect(mp.getModelNames()).toContain("ductflange")
  expect(mp.string(example).json()).toEqual(expected)
  expect(
    mp
      .string(
        "DUCTFLANGE_PITCHCIRCLEDIAMETER18cm_HOLEDIAMETER6.6MM_HOLECOUNT8_THICKNESS.2cm_OUTERDIAMETER20cm_INNERDIAMETER15cm",
      )
      .json(),
  ).toEqual(expected)
  expect(
    mp.string(example.replace("clock0deg", "clock22.5DEG")).json(),
  ).toEqual({ ...expected, clockAngle: 22.5 })
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
})

test("ductflange reports the bore, bolt circle and material webs", () => {
  const flange = getDuctFlangeDimensions(input)
  expect(flange.boreRadius).toBe(75)
  expect(flange.pitchRadius).toBe(90)
  expect(flange.holeRadius).toBeCloseTo(3.3)
  expect(flange.innerWeb).toBeCloseTo(11.7)
  expect(flange.outerWeb).toBeCloseTo(6.7)
  expect(flange.anglePitch).toBe(45)
  expect(flange.size).toEqual([200, 200, 2])
  expect(flange.bounds).toEqual({ min: [-100, -100, 0], max: [100, 100, 2] })
})

test("ductflange requires positive clearance at both edges and between holes", () => {
  expect(valid({ pitchCircleDiameter: 156.6 })).toBe(false)
  expect(valid({ pitchCircleDiameter: 156.61 })).toBe(true)
  expect(valid({ pitchCircleDiameter: 193.4 })).toBe(false)
  expect(valid({ pitchCircleDiameter: 193.39 })).toBe(true)
  expect(valid({ holeCount: 1 })).toBe(true)
  expect(valid({ holeCount: 85 })).toBe(true)
  expect(valid({ holeCount: 86 })).toBe(false)
  expect(valid({ innerDiameter: 200 })).toBe(false)
})

test("ductflange rejects repeated or collapsed centers and invalid counts or angles", () => {
  expect(valid({ holeCount: 0 })).toBe(false)
  expect(valid({ holeCount: 1.5 })).toBe(false)
  expect(valid({ holeCount: Number.MAX_SAFE_INTEGER + 1 })).toBe(false)
  const dense = { holeCount: Number.MAX_SAFE_INTEGER, holeDiameter: 3e-14 }
  const step = 360 / dense.holeCount
  const angles = Array.from(
    { length: 32 },
    (_, i) => (dense.holeCount - 32 + i) * step,
  )
  expect(new Set(angles).size).toBeLessThan(angles.length)
  expect(valid(dense)).toBe(false)
  expect(valid({ ...dense, holeCount: 1_000_000 })).toBe(true)
  expect(valid({ clockAngle: 360 })).toBe(false)
  expect(valid({ clockAngle: -1 })).toBe(false)
})

test("ductflange rejects malformed model strings and extra properties", () => {
  for (const invalid of [
    example + "_holecount8",
    example + "_clockangle0deg",
    example + "_round",
    example.replace("_holes8", "_holes8.0"),
    example.replace("_clock0deg", "_clock0rad"),
    example.replace("_hole6.6mm", "_hole6.6mmjunk"),
    example.replace("_pcd180mm", ""),
  ]) {
    expect(() => mp.string(invalid).json()).toThrow()
  }
  expect(
    modelDefinitionSchema.safeParse({ ...expected, bevel: 1 }).success,
  ).toBe(false)
})
