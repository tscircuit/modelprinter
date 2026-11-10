import { expect, test } from "bun:test"
import {
  getTeeBeamDimensions,
  modelDefinitionSchema,
  mp,
  teeBeamModelPropsSchema,
} from "../src"

const example = "teebeam_h40mm_w40mm_web4mm_flange4mm_rootr2mm_l200mm"
const input = {
  height: 40,
  width: 40,
  webThickness: 4,
  flangeThickness: 4,
  length: 200,
}
const expected = { fn: "teebeam" as const, ...input, rootRadius: 2 }

test("teebeam registers the model and normalizes short and full tokens", () => {
  expect(mp.getModelNames()).toContain("teebeam")
  expect(mp.string(example).json()).toEqual(expected)
  expect(
    mp
      .string(
        "TEEBEAM_LENGTH.2m_ROOTRADIUS.2cm_FLANGETHICKNESS.4cm_WEBTHICKNESS4MM_WIDTH4cm_HEIGHT4cm",
      )
      .json(),
  ).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(mp.string(example.replace("_rootr2mm", "")).json()).toEqual({
    ...expected,
    rootRadius: 0,
  })
})

test("teebeam reports the section envelope and remaining flat faces", () => {
  const beam = getTeeBeamDimensions({ ...input, rootRadius: 2 })
  expect(beam.flangeOverhang).toBe(18)
  expect(beam.webHeight).toBe(36)
  expect(beam.flatFlangeLength).toBe(16)
  expect(beam.flatWebHeight).toBe(34)
  expect(beam.size).toEqual([40, 40, 200])
  expect(beam.bounds).toEqual({ min: [-20, 0, 0], max: [20, 40, 200] })
  expect(getTeeBeamDimensions(input).flatFlangeLength).toBe(18)
})

test("teebeam roots must leave material and distinct flat faces", () => {
  expect(
    getTeeBeamDimensions({ ...input, rootRadius: 17.99 }).flatFlangeLength,
  ).toBeGreaterThan(0)
  for (const invalid of [
    { webThickness: 40 },
    { flangeThickness: 40 },
    { rootRadius: 18 },
    { width: 100, rootRadius: 36 },
    { rootRadius: -1 },
    { height: 1e16, flangeThickness: 1e15, rootRadius: 0.01 },
    { webThickness: Number.MIN_VALUE },
  ]) {
    expect(
      teeBeamModelPropsSchema.safeParse({ ...input, ...invalid }).success,
    ).toBe(false)
  }
})

test("teebeam rejects malformed, duplicate and unsupported parameters", () => {
  for (const invalid of [
    example + "_rootradius2",
    example + "_webthickness4",
    example + "_rotated",
    example.replace("_rootr2mm", "_rootr2mmjunk"),
    example.replace("_flange4mm", ""),
  ]) {
    expect(() => mp.string(invalid).json()).toThrow()
  }
  expect(
    modelDefinitionSchema.safeParse({ ...expected, centered: false }).success,
  ).toBe(false)
})
