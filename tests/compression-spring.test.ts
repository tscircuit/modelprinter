import { expect, test } from "bun:test"
import {
  compressionSpringModelPropsSchema,
  getCompressionSpringCenterlinePoint,
  getCompressionSpringDimensions,
  modelDefinitionSchema,
  modelprinter,
  mp,
} from "../src"

const base = {
  outerDiameter: 8,
  wireDiameter: 1,
  freeLength: 20,
  totalTurns: 8,
}

test("compression spring roadmap example resolves defaults and custom dimensions", () => {
  const builder = mp.string(
    "compressionspring_spec(custom)_od8mm_wire1mm_l20mm_turns8_active6_ends(closedground)_hand(right)_state(free)",
  )
  expect(builder.params()).toMatchObject({
    od: "8mm",
    wire: "1mm",
    turns: "8",
    active: "6",
  })
  const model = builder.json()
  expect(model).toEqual({
    fn: "compressionspring",
    spec: "custom",
    ...base,
    activeTurns: 6,
    ends: "closedground",
    hand: "right",
    state: "free",
  })
  expect(modelDefinitionSchema.parse(model)).toEqual(model)
  expect(modelprinter.getModelNames()).toContain("compressionspring")
  expect(getCompressionSpringDimensions(base)).toEqual({
    outerDiameter: 8,
    wireDiameter: 1,
    insideDiameter: 6,
    meanDiameter: 7,
    freeLength: 20,
    totalTurns: 8,
    activeTurns: 6,
    endTurns: 1,
    endPitch: 1,
    activePitch: 3,
    solidHeight: 8,
    availableTravel: 12,
    lowerBearingZ: 0,
    upperBearingZ: 20,
  })
})

test("compression spring units and mirrored winding preserve mounting datums", () => {
  expect(
    mp
      .string("COMPRESSIONSPRING_OD0.8cm_WIRE0.1cm_LENGTH2cm_TURNS8_HAND(LEFT)")
      .json(),
  ).toMatchObject({ ...base, activeTurns: 6, hand: "left" })
  expect(
    compressionSpringModelPropsSchema.parse({ ...base, freeLength: "1in" })
      .freeLength,
  ).toBeCloseTo(25.4)
  for (const [turn, height] of [
    [0, 0],
    [1, 1],
    [4, 10],
    [7, 19],
    [8, 20],
  ]) {
    const point = getCompressionSpringCenterlinePoint(base, turn!)
    expect(point.z).toBe(height!)
    expect(Math.hypot(point.x, point.y)).toBeCloseTo(3.5)
  }
  const right = getCompressionSpringCenterlinePoint(base, 0.25)
  const left = getCompressionSpringCenterlinePoint(
    { ...base, hand: "left" },
    0.25,
  )
  expect(right.y).toBeCloseTo(3.5)
  expect(left.y).toBeCloseTo(-3.5)
  expect(left.z).toBe(right.z)
  expect(getCompressionSpringCenterlinePoint(base, 8)).toEqual({
    x: 3.5,
    y: 0,
    z: 20,
  })
})

test("compression spring validates closed-ground counts, bore and solid clearance", () => {
  const source = "compressionspring_od8mm_wire1mm_l20mm_turns8"
  for (const invalid of [
    "compressionspring",
    "compressionspring_od8mm_wire1mm_l20mm",
    `${source}_active7`,
    `${source}_active6_active6`,
    `${source}_turns9`,
    `${source}_l25mm`,
    `${source}_freelength25mm`,
    `${source}_ends(open)`,
    `${source}_spec(iso10243)`,
    `${source}_state(solid)`,
    `${source}_hand(up)`,
    `${source}_hand`,
    `${source}_threadhand(left)`,
    `${source}_unknown`,
    "compressionspring8_od8mm_wire1mm_l20mm_turns8",
    "compressionspring_od8mm_wire1mm_l8mm_turns8",
    "compressionspring_od8mm_wire1mm_l7mm_turns8",
    "compressionspring_od2mm_wire1mm_l20mm_turns8",
    "compressionspring_od8mm_wire1mm_l20mm_turns2",
    "compressionspring_od8mm_wire1mm_l20mm_turns8.5",
    "compressionspring_od8mm_wire1mm_l20mm_turns8mm",
    "compressionspring_od8mm_wire1mm_l20mmjunk_turns8",
  ])
    expect(() => mp.string(invalid).json()).toThrow()
  for (const freeLength of [NaN, Infinity, 0, -1, 8, "20mm junk"])
    expect(() =>
      compressionSpringModelPropsSchema.parse({ ...base, freeLength }),
    ).toThrow()
  for (const totalTurns of [NaN, Infinity, 2, 8.5, Number.MAX_SAFE_INTEGER + 1])
    expect(() =>
      compressionSpringModelPropsSchema.parse({ ...base, totalTurns }),
    ).toThrow()
  expect(() =>
    compressionSpringModelPropsSchema.parse({ ...base, activeTurns: 5 }),
  ).toThrow()
  expect(() =>
    compressionSpringModelPropsSchema.parse({ ...base, pitch: 3 }),
  ).toThrow()
  expect(() =>
    getCompressionSpringDimensions({
      ...base,
      wireDiameter: 1e308,
      outerDiameter: 1.7e308,
    }),
  ).toThrow()
  for (const turn of [-1, 9, NaN, Infinity])
    expect(() => getCompressionSpringCenterlinePoint(base, turn)).toThrow()
  expect(
    getCompressionSpringDimensions({ ...base, freeLength: 8.01 }).activePitch,
  ).toBeGreaterThan(1)
  expect(
    compressionSpringModelPropsSchema.parse({ ...base, totalTurns: 3 })
      .activeTurns,
  ).toBe(1)
})
