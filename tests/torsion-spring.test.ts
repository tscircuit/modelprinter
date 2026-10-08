import { expect, test } from "bun:test"
import {
  mp,
  modelprinter,
  modelDefinitionSchema,
  torsionSpringModelPropsSchema,
  getTorsionSpringDimensions,
  getTorsionSpringFrame,
} from "../src"
const source =
  "torsionspring_od8mm_wire0.8mm_turns3.25_pitch1mm_start10mm_end14mm_right"
test("torsion spring defaults, fractional turns and public registry", () => {
  const p = torsionSpringModelPropsSchema.parse({})
  expect(p).toEqual({
    outerDiameter: 8,
    wireDiameter: 0.8,
    turns: 3.25,
    pitch: 1,
    startLegLength: 10,
    endLegLength: 14,
    leftHand: false,
  })
  const d = mp.string(source).json()
  expect(d).toEqual({ fn: "torsionspring", ...p })
  expect(mp.string("torsionspring").json()).toEqual(d)
  expect(modelDefinitionSchema.parse(d)).toEqual(d)
  expect(torsionSpringModelPropsSchema.parse(p)).toEqual(p)
  expect(modelprinter.getModelNames()).toContain("torsionspring")
  expect(getTorsionSpringDimensions({})).toMatchObject({
    meanRadius: 3.6,
    insideDiameter: 6.4,
    axialAdvance: 3.25,
    endPhaseDegrees: 90,
    pitch: 1,
  })
  expect(getTorsionSpringDimensions({ turns: 4.5 }).endPhaseDegrees).toBe(180)
})
test("torsion spring units, scaled default pitch and value-free handedness", () => {
  expect(
    mp.string("TORSIONSPRING_OD0.8cm_WIRE0.08cm_START1in_LEFT").json(),
  ).toMatchObject({
    outerDiameter: 8,
    wireDiameter: 0.8,
    startLegLength: 25.4,
    leftHand: true,
    pitch: 1,
  })
  expect(
    torsionSpringModelPropsSchema.parse({ outerDiameter: 12, wireDiameter: 2 })
      .pitch,
  ).toBe(2.5)
})
test("torsion spring frames are continuous, orthonormal and mirror winding", () => {
  const d = getTorsionSpringDimensions({})
  const dot = (a: number[], b: number[]) =>
    a.reduce((sum, v, i) => sum + v * b[i]!, 0)
  const start = 10,
    end = start + d.coilLength
  expect(getTorsionSpringFrame({}, start).position).toEqual([3.6, 0, 0])
  const last = getTorsionSpringFrame({}, end)
  expect(last.position[0]).toBeCloseTo(0, 10)
  expect(last.position[1]).toBeCloseTo(3.6, 10)
  expect(last.position[2]).toBeCloseTo(3.25, 10)
  for (const s of [
    0,
    start,
    start + d.lengthPerTurn / 4,
    end,
    d.centerlineLength,
  ]) {
    const f = getTorsionSpringFrame({}, s),
      mirror = getTorsionSpringFrame({ leftHand: true }, s)
    for (const axis of [f.normal, f.binormal, f.tangent])
      expect(Math.hypot(...axis)).toBeCloseTo(1, 12)
    expect(dot(f.normal, f.binormal)).toBeCloseTo(0, 12)
    expect(dot(f.normal, f.tangent)).toBeCloseTo(0, 12)
    expect(dot(f.binormal, f.tangent)).toBeCloseTo(0, 12)
    expect(mirror.position[0]).toBeCloseTo(f.position[0], 12)
    expect(mirror.position[1]).toBeCloseTo(-f.position[1], 12)
    expect(mirror.position[2]).toBeCloseTo(f.position[2], 12)
  }
  for (const join of [start, end]) {
    const a = getTorsionSpringFrame({}, join - 1e-6),
      b = getTorsionSpringFrame({}, join + 1e-6)
    expect(
      Math.hypot(...a.position.map((n, i) => n - b.position[i]!)),
    ).toBeLessThan(2.01e-6)
    expect(dot(a.tangent, b.tangent)).toBeCloseTo(1, 10)
  }
  for (const s of [-1, NaN, Infinity, d.centerlineLength + 1])
    expect(() => getTorsionSpringFrame({}, s)).toThrow()
})
test("torsion spring rejects overlapping coils and conflicting selectors", () => {
  for (const value of [
    "torsionspring8",
    `${source}_left`,
    `${source}_right`,
    "torsionspring_left_left",
    "torsionspring_left(false)",
    "torsionspring_hand(left)",
    "torsionspring_od2mm_wire1mm",
    "torsionspring_pitch0.8mm",
    "torsionspring_turns0.5",
    "torsionspring_turns129",
    "torsionspring_turns3mm",
    "torsionspring_turns3junk",
    "torsionspring_start0mm",
    "torsionspring_end-1mm",
    `${source}_pitch1mm`,
    "torsionspring_unknown1",
    "torsionspring_wire",
  ])
    expect(() => mp.string(value).json()).toThrow()
  for (const turns of [0, NaN, Infinity, 129])
    expect(() => torsionSpringModelPropsSchema.parse({ turns })).toThrow()
  for (const wireDiameter of [0, -1, NaN, Infinity, "1mm junk"])
    expect(() =>
      torsionSpringModelPropsSchema.parse({ wireDiameter }),
    ).toThrow()
  expect(() =>
    torsionSpringModelPropsSchema.parse({ leftHand: "left" }),
  ).toThrow()
  expect(() => torsionSpringModelPropsSchema.parse({ hand: "left" })).toThrow()
  expect(() => torsionSpringModelPropsSchema.parse({ pitch: 1e308 })).toThrow()
})
