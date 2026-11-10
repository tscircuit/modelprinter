import { expect, test } from "bun:test"
import {
  forkWasherModelPropsSchema,
  getForkWasherDimensions,
  modelDefinitionSchema,
  mp,
} from "../src"

const example = "forkwasher_slotw6.5mm_slotl18mm_w20mm_l25mm_h2mm"
const input = {
  slotWidth: 6.5,
  slotLength: 18,
  width: 20,
  length: 25,
  thickness: 2,
}
const expected = { fn: "forkwasher" as const, ...input }

test("forkwasher registers the model and normalizes aliases and units", () => {
  expect(mp.getModelNames()).toContain("forkwasher")
  expect(mp.string(example).json()).toEqual(expected)
  expect(
    mp
      .string(
        "FORKWASHER_THICKNESS.2CM_LENGTH2.5cm_WIDTH2cm_SLOTLENGTH1.8cm_SLOTWIDTH.65cm",
      )
      .json(),
  ).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
})

test("forkwasher reports the slot root and positive side and rear walls", () => {
  const washer = getForkWasherDimensions(input)
  expect(washer.rootRadius).toBe(3.25)
  expect(washer.rootCenterY).toBe(14.75)
  expect(washer.sideWall).toBe(6.75)
  expect(washer.backWall).toBe(7)
  expect(washer.size).toEqual([20, 25, 2])
  expect(washer.bounds).toEqual({ min: [-10, 0, 0], max: [10, 25, 2] })
  expect(
    getForkWasherDimensions({ ...input, width: 6.51, length: 18.01 }).backWall,
  ).toBeGreaterThan(0)
})

test("forkwasher rejects a slot that consumes a wall or loses its straight sides", () => {
  for (const invalid of [
    { width: 6.5 },
    { width: 6 },
    { length: 18 },
    { length: 17 },
    { slotLength: 3.25 },
    { slotLength: 3 },
    { slotWidth: Number.MIN_VALUE },
    { length: 1e308, slotLength: 1e307 },
    { thickness: 0 },
  ]) {
    expect(
      forkWasherModelPropsSchema.safeParse({ ...input, ...invalid }).success,
    ).toBe(false)
  }
  expect(
    getForkWasherDimensions({ ...input, slotLength: 3.26 }).rootCenterY,
  ).toBeGreaterThan(0)
})

test("forkwasher rejects a rounded root that collapses at its coordinate scale", () => {
  for (const edge of [
    { ...input, slotWidth: 2, slotLength: 1e16 + 2, length: 1e16 + 10 },
    {
      width: 2,
      slotWidth: Number.EPSILON,
      slotLength: 1 + Number.EPSILON,
      length: 2,
      thickness: 1,
    },
  ]) {
    const radius = edge.slotWidth / 2
    const center = edge.slotLength - radius
    expect(center + radius).toBe(center)
    expect(forkWasherModelPropsSchema.safeParse(edge).success).toBe(false)
  }
  const washer = getForkWasherDimensions({
    ...input,
    slotWidth: 4,
    slotLength: 1e16 + 4,
    length: 1e16 + 10,
  })
  expect(washer.rootCenterY + washer.rootRadius).toBeGreaterThan(
    washer.rootCenterY,
  )
})

test("forkwasher rejects unknown, duplicate and malformed parameters", () => {
  for (const invalid of [
    example + "_slotwidth6.5",
    example + "_t2mm",
    example + "_closed",
    example.replace("_slotw6.5mm", "_slotw6.5mmjunk"),
    example.replace("_slotl18mm", ""),
    example.replace("forkwasher_", "forkwasher1_"),
  ]) {
    expect(() => mp.string(invalid).json()).toThrow()
  }
  expect(
    modelDefinitionSchema.safeParse({ ...expected, closed: true }).success,
  ).toBe(false)
})
