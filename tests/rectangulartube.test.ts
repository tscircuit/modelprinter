import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  rectangularTubeModelPropsSchema,
  getRectangularTubeDimensions,
} from "../src"
const source = "rectangulartube_w40mm_h20mm_wall2mm_l60mm_outerr4mm_innerr2mm"
const expected = {
  fn: "rectangulartube",
  width: 40,
  height: 20,
  wallThickness: 2,
  length: 60,
  outerRadius: 4,
  innerRadius: 2,
} as const
test("rectangulartube contract, units, public schema and registry", () => {
  expect(mp.string(source).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...props } = expected
  expect(rectangularTubeModelPropsSchema.parse(props)).toEqual(props)
  expect(getRectangularTubeDimensions(props).bottomZ).toBe(0)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(
    rectangularTubeModelPropsSchema.parse({
      ...props,
      width: `${props.width / 10}cm`,
    }),
  ).toEqual(props)
})
test("rectangulartube rejects malformed, repeated, missing and nonfinite dimensions", () => {
  for (const suffix of ["", "typo1mm", "constructor1", "w1mm", "width1mm"])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  expect(() => mp.string("rectangulartube").json()).toThrow()
  const { fn, ...props } = expected
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      rectangularTubeModelPropsSchema.parse({ ...props, width: value }),
    ).toThrow()
  expect(() =>
    rectangularTubeModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
})

test("rectangulartube rejects incompatible attachment and profile dimensions", () => {
  const { fn, ...props } = expected
  for (const invalid of [
    { wallThickness: 10 },
    { outerRadius: 9, innerRadius: 0 },
  ])
    expect(() =>
      rectangularTubeModelPropsSchema.parse({ ...props, ...invalid }),
    ).toThrow()
})
