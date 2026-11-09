import { expect, test } from "bun:test"
import {
  getWedgeBlankDimensions,
  wedgeBlankModelDefinitionSchema,
  wedgeBlankModelPropsSchema,
  modelDefinitionSchema,
  mp,
  type WedgeBlankModelDefinition,
  type ModelDefinition,
} from "../src"

const bare = "wedgeblank_l80mm_w40mm_h20mm_tip2mm"
const props = {
  length: 80,
  width: 40,
  height: 20,
  tipHeight: 2,
  lengthwise: true,
  edgeRadius: 0,
} as const

test("wedgeblank is available through the root registry and definition schemas", () => {
  const expected: WedgeBlankModelDefinition = { fn: "wedgeblank", ...props }
  const parsed: ModelDefinition = mp
    .string("wedgeblank_l80mm_w40mm_h20mm_tip2mm_lengthwise_edger0mm")
    .json()
  expect(parsed).toEqual(expected)
  expect(modelDefinitionSchema.parse(parsed)).toEqual(expected)
  expect(wedgeBlankModelDefinitionSchema.parse(parsed)).toEqual(expected)
  expect(mp.getModelNames().filter((name) => name === "wedgeblank")).toEqual([
    "wedgeblank",
  ])
})

test("wedgeblank accepts full aliases, mixed units, order and case", () => {
  expect(
    mp.string("WEDGEBLANK_TIPHEIGHT.2CM_HEIGHT2CM_WIDTH.04M_LENGTH8CM").json(),
  ).toEqual({ fn: "wedgeblank", ...props })
})

test("wedgeblank keeps the nominal envelope after longitudinal rounding", () => {
  const rounded = getWedgeBlankDimensions({ ...props, edgeRadius: 0.98 })
  expect(rounded.size).toEqual([40, 20, 80])
  expect(rounded.bounds).toEqual({ min: [-20, 0, 0], max: [20, 20, 80] })
  expect([rounded.thickEndZ, rounded.thinEndZ]).toEqual([0, 80])
  expect(rounded.rise).toBe(18)
  expect(rounded.taperAngleDegrees).toBeCloseTo(
    (Math.atan(0.225) * 180) / Math.PI,
    12,
  )
})

test("wedgeblank rejects a fillet that consumes the side at the thin end", () => {
  expect(
    wedgeBlankModelPropsSchema.safeParse({ ...props, edgeRadius: 0.99 })
      .success,
  ).toBe(false)
  expect(
    wedgeBlankModelPropsSchema.safeParse({
      ...props,
      length: 1,
      edgeRadius: 0.1,
    }).success,
  ).toBe(true)
  expect(
    wedgeBlankModelPropsSchema.safeParse({
      ...props,
      length: 1,
      edgeRadius: 0.11,
    }).success,
  ).toBe(false)
  expect(
    wedgeBlankModelPropsSchema.safeParse({
      ...props,
      width: 1.8,
      edgeRadius: 0.9,
    }).success,
  ).toBe(false)
  expect(() => mp.string(bare + "_edger.99mm").json()).toThrow()
})

test("wedgeblank treats contact at the numerical limit as a collapsed side", () => {
  // The inclined edge is 13 mm for a rise of 5 mm over a 12 mm run.
  const exactContact = { length: 12, width: 48, height: 30, tipHeight: 25 }
  expect(
    wedgeBlankModelPropsSchema.safeParse({ ...exactContact, edgeRadius: 12 })
      .success,
  ).toBe(false)
  expect(
    wedgeBlankModelPropsSchema.safeParse({ ...exactContact, edgeRadius: 11.99 })
      .success,
  ).toBe(true)
  const steep = { length: 0.02, width: 40, height: 1, tipHeight: 0.025 }
  expect(
    wedgeBlankModelPropsSchema.safeParse({
      ...steep,
      edgeRadius: 0.0005024089975707669,
    }).success,
  ).toBe(false)
  expect(
    wedgeBlankModelPropsSchema.safeParse({
      ...steep,
      edgeRadius: 0.0005024089975707,
    }).success,
  ).toBe(true)
})

test("wedgeblank validates a positive taper and keeps finite dimensions at extreme scale", () => {
  const u = Number.MIN_VALUE
  for (const input of [
    { ...props, tipHeight: 0 },
    { ...props, tipHeight: 20 },
    { ...props, tipHeight: 21 },
    { ...props, edgeRadius: -1 },
    { ...props, lengthwise: false },
    { ...props, taperAxis: "length" },
    { ...props, length: "80mm\n" },
    { ...props, width: 3 * u },
    { ...props, height: Infinity },
  ])
    expect(wedgeBlankModelPropsSchema.safeParse(input).success).toBe(false)
  const tiny = getWedgeBlankDimensions({ ...props, width: 4 * u })
  expect(tiny.bounds.max[0] - tiny.bounds.min[0]).toBe(4 * u)
  const steep = getWedgeBlankDimensions({
    length: 1e-100,
    width: 2,
    height: 1e300,
    tipHeight: 1e299,
    edgeRadius: 1e-102,
  })
  expect(steep.taperAngleDegrees).toBeCloseTo(90, 12)
  expect(Number.isFinite(steep.rise)).toBe(true)
})

test("wedgeblank rejects duplicate properties, unknown tokens and incomplete strings", () => {
  for (const suffix of [
    "l81",
    "length81",
    "w41",
    "h21",
    "tip3",
    "tipheight3",
    "edger",
    "edger1e0",
    "edger1mmextra",
    "lengthwise0",
    "lengthwise(false)",
    "lengthwise_lengthwise",
    "taperaxis(length)",
    "constructor1",
    "",
  ])
    expect(() => mp.string(bare + "_" + suffix).json()).toThrow()
  expect(() =>
    mp.string("wedgeblank12" + bare.slice("wedgeblank".length)).json(),
  ).toThrow()
  expect(() => mp.string("wedgeblank_l80mm_w40mm_h20mm").json()).toThrow()
})
