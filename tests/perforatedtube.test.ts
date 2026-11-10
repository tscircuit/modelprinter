import { expect, test } from "bun:test"
import {
  getPerforatedTubeDimensions,
  modelDefinitionSchema,
  mp,
  perforatedTubeModelPropsSchema,
} from "../src"

const example =
  "perforatedtube_od25mm_wall2mm_l100mm_hole3mm_axialpitch10mm_rows9_end10mm_around8_stagger0deg"
const input = {
  outerDiameter: 25,
  wallThickness: 2,
  length: 100,
  holeDiameter: 3,
  axialPitch: 10,
  rowCount: 9,
  endOffset: 10,
  holesAround: 8,
}
const props = { ...input, staggerAngle: 0 }
const valid = (overrides: Partial<typeof props>) =>
  perforatedTubeModelPropsSchema.safeParse({ ...props, ...overrides }).success

test("perforatedtube registers the roadmap model and defaults stagger to zero", () => {
  const expected = { fn: "perforatedtube" as const, ...props }
  expect(mp.getModelNames()).toContain("perforatedtube")
  expect(mp.string(example).json()).toEqual(expected)
  expect(
    mp
      .string(
        "PERFORATEDTUBE_holesAround8_endOffset1CM_rowCount9_axialPitch.01m_holeDiameter.3cm_length10cm_wallThickness.2cm_outerDiameter2.5cm",
      )
      .json(),
  ).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  expect(perforatedTubeModelPropsSchema.parse(input)).toEqual(props)
})

test("perforatedtube reports the bore, layout and envelope", () => {
  const tube = getPerforatedTubeDimensions(input)
  expect(tube.innerDiameter).toBe(21)
  expect(tube.holeRadius).toBe(1.5)
  expect([tube.firstRowZ, tube.lastRowZ]).toEqual([10, 90])
  expect([tube.firstEndMargin, tube.lastEndMargin]).toEqual([8.5, 8.5])
  expect(tube.anglePitch).toBe(45)
  expect(tube.totalHoles).toBe(72)
  expect(tube.size).toEqual([25, 25, 100])
  expect(tube.bounds).toEqual({
    min: [-12.5, -12.5, 0],
    max: [12.5, 12.5, 100],
  })
})

test("perforatedtube validates holes against the inside wall and both ends", () => {
  expect(valid({ length: 91.51 })).toBe(true)
  expect(valid({ length: 91.5 })).toBe(false)
  expect(valid({ endOffset: 1.5 })).toBe(false)
  expect(valid({ holeDiameter: 8 })).toBe(true)
  expect(valid({ holeDiameter: 8.1 })).toBe(false)
  expect(valid({ wallThickness: 12.5 })).toBe(false)
  expect(
    valid({ holeDiameter: 21, holesAround: 1, rowCount: 1, endOffset: 20 }),
  ).toBe(false)
  expect(valid({ holesAround: 1, rowCount: 1 })).toBe(true)
})

test("perforatedtube accounts for alternating stagger and the nearest angular neighbor", () => {
  expect(valid({ axialPitch: 2, staggerAngle: 22.5 })).toBe(true)
  expect(valid({ axialPitch: 2 })).toBe(false)
  expect(valid({ axialPitch: 2, staggerAngle: 44 })).toBe(false)
  expect(valid({ axialPitch: 1.5, staggerAngle: 22.5, rowCount: 2 })).toBe(true)
  expect(valid({ axialPitch: 1.5, staggerAngle: 22.5, rowCount: 3 })).toBe(
    false,
  )
  expect(valid({ staggerAngle: 45 })).toBe(false)
  expect(valid({ staggerAngle: -1 })).toBe(false)
  const staggered = mp
    .string(example.replace("stagger0deg", "stagger22.5DEG"))
    .json()
  expect(staggered).toEqual({
    fn: "perforatedtube",
    ...props,
    staggerAngle: 22.5,
  })
})

test("perforatedtube requires representable coordinates and safe hole counts", () => {
  expect(valid({ axialPitch: 1, length: 1e17, endOffset: 1e16 })).toBe(false)
  expect(valid({ outerDiameter: Number.MIN_VALUE })).toBe(false)
  expect(valid({ holesAround: 0 })).toBe(false)
  expect(valid({ rowCount: 1.5 })).toBe(false)
  expect(valid({ rowCount: Number.MAX_SAFE_INTEGER + 1 })).toBe(false)
  const result = perforatedTubeModelPropsSchema.safeParse({
    ...props,
    rowCount: Number.MAX_SAFE_INTEGER,
    holesAround: 2,
  })
  expect(result.success).toBe(false)
  if (!result.success) {
    expect(
      result.error.issues.some((issue) => issue.path[0] === "holesAround"),
    ).toBe(true)
  }
})

test("perforatedtube keeps the web after rounding distant row coordinates", () => {
  const farRows = { length: 1e15 + 10, endOffset: 1e15, rowCount: 4 }
  const adjacent = { ...farRows, axialPitch: 0.94, holeDiameter: 0.91 }
  const zAt = (index: number) => farRows.endOffset + index * adjacent.axialPitch
  expect(zAt(2) - zAt(1)).toBe(0.875)
  expect(valid(adjacent)).toBe(false)
  expect(valid({ ...adjacent, holeDiameter: 0.01 })).toBe(true)

  const alternate = {
    ...farRows,
    axialPitch: 0.95,
    holeDiameter: 1.89,
    staggerAngle: 22.5,
  }
  expect(farRows.endOffset + 2 * alternate.axialPitch - farRows.endOffset).toBe(
    1.875,
  )
  expect(valid(alternate)).toBe(false)
})

test("perforatedtube rejects angular gaps that collapse at the end of a full turn", () => {
  const dense = {
    holesAround: Number.MAX_SAFE_INTEGER,
    holeDiameter: 3e-15,
    rowCount: 1,
  }
  const step = 360 / dense.holesAround
  const lastAngles = Array.from(
    { length: 32 },
    (_, i) => (dense.holesAround - 32 + i) * step,
  )
  expect(new Set(lastAngles).size).toBeLessThan(lastAngles.length)
  expect(valid(dense)).toBe(false)
  expect(valid({ ...dense, holesAround: 1_000_000 })).toBe(true)
})

test("perforatedtube rejects unknown, repeated and malformed fields", () => {
  for (const invalid of [
    example + "_rowcount9",
    example + "_open",
    example.replace("rows9", "rows9.0"),
    example.replace("around8", "around8mm"),
    example.replace("stagger0deg", "stagger0rad"),
    example.replace("hole3mm", "hole3mmjunk"),
    example.replace("_axialpitch10mm", ""),
  ]) {
    expect(() => mp.string(invalid).json()).toThrow()
  }
  expect(
    modelDefinitionSchema.safeParse({
      fn: "perforatedtube",
      ...props,
      throughBothWalls: true,
    }).success,
  ).toBe(false)
})
