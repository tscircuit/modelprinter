import { expect, test } from "bun:test"
import {
  type CWasherModelDefinition,
  cWasherModelPropsSchema,
  getCWasherDimensions,
  modelDefinitionSchema,
  mp,
} from "../src"

const roadmap =
  "cwasher_spec(custom)_id8.4mm_od22mm_h2mm_gap10mm_cut(parallel)_opening(radial)"
const input = {
  innerDiameter: 8.4,
  outerDiameter: 22,
  thickness: 2,
  gapWidth: 10,
}
const expected = {
  fn: "cwasher",
  ...input,
  custom: true,
  parallelCut: true,
  radialOpening: true,
} satisfies CWasherModelDefinition

test("cwasher parses the roadmap string, aliases and mixed units", () => {
  expect(mp.getModelNames()).toContain("cwasher")
  expect(mp.string(roadmap).json()).toEqual(expected)
  expect(mp.string("cwasher_id8.4mm_od22mm_h2mm_gap10mm").json()).toEqual(
    expected,
  )
  expect(
    mp
      .string(
        "CWASHER_GAPWIDTH1cm_THICKNESS.2CM_OD2.2cm_INNERDIAMETER.84cm_CUSTOM_PARALLELCUT_RADIALOPENING",
      )
      .json(),
  ).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
})

test("cwasher permits openings narrower than, equal to and wider than the bore", () => {
  for (const gapWidth of [4, 8.4, 10, 21.99]) {
    const washer = getCWasherDimensions({ ...input, gapWidth })
    expect(washer.innerRadius).toBe(4.2)
    expect(washer.outerRadius).toBe(11)
    expect(washer.radialWidth).toBeCloseTo(6.8, 12)
    expect(washer.halfGapWidth).toBe(gapWidth / 2)
    expect(washer.gapSideMargin).toBeGreaterThan(0)
  }
  expect(getCWasherDimensions(input).gapSideMargin).toBe(6)
})

test("cwasher rejects empty or collapsed sections and unsupported values", () => {
  for (const invalid of [
    { innerDiameter: 22 },
    { outerDiameter: 8 },
    { thickness: 0 },
    { gapWidth: 0 },
    { gapWidth: 22 },
    { gapWidth: 23 },
    { gapWidth: Number.MIN_VALUE },
    { innerDiameter: Number.MIN_VALUE },
    { outerDiameter: Infinity },
    { parallelCut: false },
    { radialOpening: false },
  ]) {
    expect(
      cWasherModelPropsSchema.safeParse({ ...input, ...invalid }).success,
    ).toBe(false)
  }
})

test("cwasher rejects duplicate aliases and malformed tokens", () => {
  for (const invalid of [
    roadmap + "_gapwidth9mm",
    roadmap + "_radialopening",
    roadmap + "_parallelcut",
    roadmap + "_custom",
    roadmap + "_t2mm",
    roadmap.replace("_gap10mm", "_gap10mmjunk"),
    roadmap.replace("_cut(parallel)", "_cut(angled)"),
    roadmap.replace("_opening(radial)", "_opening(tangent)"),
    roadmap.replace("_spec(custom)", "_spec(din)"),
    roadmap.replace("_h2mm", ""),
  ]) {
    expect(() => mp.string(invalid).json()).toThrow()
  }
  expect(
    modelDefinitionSchema.safeParse({ ...expected, angle: 30 }).success,
  ).toBe(false)
})
