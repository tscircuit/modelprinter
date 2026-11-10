import { expect, test } from "bun:test"
import {
  getTorsionBarDimensions,
  modelDefinitionSchema,
  mp,
  torsionBarModelPropsSchema,
} from "../src"

const example =
  "torsionbar_d10mm_l150mm_hexends_endaf12mm_endl20mm_transition5mm"
const input = {
  diameter: 10,
  length: 150,
  endAcrossFlats: 12,
  endLength: 20,
  transitionLength: 5,
}
const props = { ...input, hexEnds: true as const }

test("torsionbar registers the roadmap model and normalizes mixed units", () => {
  const expected = { fn: "torsionbar" as const, ...props }
  expect(mp.getModelNames()).toContain("torsionbar")
  expect(mp.string(example).json()).toEqual(expected)
  expect(
    mp
      .string(
        "TORSIONBAR_endLength2CM_transitionLength0.5cm_LENGTH.15m_endAcrossFlats1.2cm_diameter1cm",
      )
      .json(),
  ).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(torsionBarModelPropsSchema.parse(input)).toEqual(props)
})

test("torsionbar reports symmetric sections and aligned hex ends", () => {
  const bar = getTorsionBarDimensions(input)
  expect([
    bar.bottomZ,
    bar.firstKeyEndZ,
    bar.middleStartZ,
    bar.middleEndZ,
    bar.lastKeyStartZ,
    bar.topZ,
  ]).toEqual([0, 20, 25, 125, 130, 150])
  expect(bar.middleLength).toBe(100)
  const cornerSpan = 12 / Math.cos(Math.PI / 6)
  expect(bar.endAcrossCorners).toBeCloseTo(cornerSpan)
  expect(bar.size[0]).toBe(12)
  expect(bar.size[1]).toBeCloseTo(cornerSpan)
  expect(bar.size[2]).toBe(150)
  expect(bar.bounds.min[0]).toBe(-6)
  expect(bar.bounds.max[1]).toBeCloseTo(cornerSpan / 2)
  expect(getTorsionBarDimensions({ ...input, diameter: 15 }).size).toEqual([
    15, 15, 150,
  ])
})

test("torsionbar requires a distinct positive span for every section", () => {
  expect(getTorsionBarDimensions({ ...input, length: 51 }).middleLength).toBe(1)
  for (const invalid of [
    { length: 50 },
    { length: 49.9 },
    { length: 1e308 },
    { endLength: 0 },
    { transitionLength: 0 },
    { transitionLength: Number.MIN_VALUE },
    { diameter: Number.MIN_VALUE },
    { endAcrossFlats: Number.MAX_VALUE },
  ]) {
    expect(
      torsionBarModelPropsSchema.safeParse({ ...input, ...invalid }).success,
    ).toBe(false)
  }
})

test("torsionbar rejects conflicting aliases, valued flags and malformed tokens", () => {
  for (const invalid of [
    example + "_diameter10mm",
    example + "_hexends",
    example.replace("_hexends", "_hexends1"),
    example.replace("_hexends", "_squareends"),
    example.replace("_endl20mm", "_endl20mmm"),
    example.replace("_d10mm", "_d"),
    example.replace("_transition5mm", ""),
    example.replace("torsionbar_", "torsionbar1_"),
  ]) {
    expect(() => mp.string(invalid).json()).toThrow()
  }
  expect(
    torsionBarModelPropsSchema.safeParse({ ...props, hexEnds: false }).success,
  ).toBe(false)
  expect(
    modelDefinitionSchema.safeParse({
      fn: "torsionbar",
      ...props,
      keyShape: "hex",
    }).success,
  ).toBe(false)
})
