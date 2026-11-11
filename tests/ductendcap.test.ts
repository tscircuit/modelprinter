import { expect, test } from "bun:test"
import {
  type DuctEndCapModelDefinition,
  ductEndCapModelPropsSchema,
  getDuctEndCapDimensions,
  modelDefinitionSchema,
  mp,
} from "../src"

const roadmap =
  "ductendcap_od150mm_depth25mm_wall0.8mm_skirtid148.4mm_face(flat)"
const input = {
  outerDiameter: 150,
  depth: 25,
  wallThickness: 0.8,
  skirtInnerDiameter: 148.4,
}
const expected = {
  fn: "ductendcap",
  ...input,
  flatFace: true,
} satisfies DuctEndCapModelDefinition

test("ductendcap parses the roadmap string, aliases and mixed units", () => {
  expect(mp.getModelNames()).toContain("ductendcap")
  expect(mp.string(roadmap).json()).toEqual(expected)
  expect(
    mp
      .string(
        "DUCTENDCAP_FLAT_SKIRTINNERDIAMETER148.4mm_WALLTHICKNESS.08cm_DEPTH2.5CM_OUTERDIAMETER15cm",
      )
      .json(),
  ).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
})

test("ductendcap derives the skirt opening and usable skirt length", () => {
  expect(mp.string("ductendcap_od150mm_depth25mm_wall.8mm").json()).toEqual(
    expected,
  )
  const dimensions = getDuctEndCapDimensions(input)
  expect(dimensions.skirtInnerDiameter).toBe(148.4)
  expect(dimensions.faceThickness).toBe(0.8)
  expect(dimensions.skirtLength).toBeCloseTo(24.2, 12)
  expect(
    getDuctEndCapDimensions({
      outerDiameter: "1in",
      depth: 6,
      wallThickness: 0.3,
      skirtInnerDiameter: 24.8,
    }).skirtInnerDiameter,
  ).toBe(24.8)
})

test("ductendcap rejects inconsistent or collapsed walls and skirts", () => {
  for (const invalid of [
    { skirtInnerDiameter: 148.4001 },
    { skirtInnerDiameter: 149 },
    { skirtInnerDiameter: 150 },
    { skirtInnerDiameter: 0 },
    { wallThickness: 75, depth: 100, skirtInnerDiameter: undefined },
    { wallThickness: 1e-20, skirtInnerDiameter: undefined },
    { depth: 0.8 },
    { depth: 0.7 },
    { depth: 1e30 },
    { flatFace: false },
  ]) {
    expect(
      ductEndCapModelPropsSchema.safeParse({ ...input, ...invalid }).success,
    ).toBe(false)
  }
})

test("ductendcap handles a narrow bore and rejects collapsed radii", () => {
  expect(
    getDuctEndCapDimensions({
      outerDiameter: 10,
      depth: 6,
      wallThickness: 4.9,
      skirtInnerDiameter: 0.2,
    }).skirtInnerDiameter,
  ).toBe(0.2)

  const unit = Number.MIN_VALUE
  expect(
    ductEndCapModelPropsSchema.safeParse({
      outerDiameter: 3 * unit,
      depth: 5 * unit,
      wallThickness: unit,
    }).success,
  ).toBe(false)
  expect(
    getDuctEndCapDimensions({
      outerDiameter: 8 * unit,
      depth: 6 * unit,
      wallThickness: 2 * unit,
    }).skirtInnerDiameter,
  ).toBe(4 * unit)
})

test("ductendcap rejects duplicate aliases, invalid faces and malformed tokens", () => {
  for (const invalid of [
    roadmap + "_outerdiameter150mm",
    roadmap + "_wallthickness0.8mm",
    roadmap + "_flat",
    roadmap.replace("face(flat)", "face(domed)"),
    roadmap.replace("_wall0.8mm", "_wall0.8mmjunk"),
    roadmap.replace("_depth25mm", ""),
  ]) {
    expect(() => mp.string(invalid).json()).toThrow()
  }
  expect(
    modelDefinitionSchema.safeParse({ ...expected, dome: 2 }).success,
  ).toBe(false)
})
