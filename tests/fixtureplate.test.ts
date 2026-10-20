import { expect, test } from "bun:test"
import {
  mp,
  modelDefinitionSchema,
  fixturePlateModelPropsSchema,
  getFixturePlateDimensions,
} from "../src"
const source =
  "fixtureplate_l80mm_w60mm_t8mm_hole6mm_cols3_rows2_pitch25mm_edgex15mm_edgey15mm"
const expected = {
  fn: "fixtureplate",
  length: 80,
  width: 60,
  thickness: 8,
  holeDiameter: 6,
  columns: 3,
  rows: 2,
  pitch: 25,
  edgeX: 15,
  edgeY: 15,
} as const
test("fixtureplate contract, units, public schema and registry", () => {
  expect(mp.string(source).json()).toEqual(expected)
  expect(modelDefinitionSchema.parse(expected)).toEqual(expected)
  const { fn, ...props } = expected
  expect(fixturePlateModelPropsSchema.parse(props)).toEqual(props)
  expect(getFixturePlateDimensions(props).bottomZ).toBe(0)
  expect(mp.string(source.toUpperCase()).json()).toEqual(expected)
  expect(
    fixturePlateModelPropsSchema.parse({
      ...props,
      length: `${props.length / 10}cm`,
    }),
  ).toEqual(props)
})
test("fixtureplate rejects malformed, repeated, missing and nonfinite dimensions", () => {
  for (const suffix of ["", "typo1mm", "constructor1", "l1mm", "length1mm"])
    expect(() => mp.string(`${source}_${suffix}`).json()).toThrow()
  expect(() => mp.string("fixtureplate").json()).toThrow()
  const { fn, ...props } = expected
  for (const value of [0, -1, Infinity, NaN, "12mmjunk", "1e2", "(12mm)"])
    expect(() =>
      fixturePlateModelPropsSchema.parse({ ...props, length: value }),
    ).toThrow()
  expect(() =>
    fixturePlateModelPropsSchema.parse({ ...props, unknown: true }),
  ).toThrow()
})

test("fixtureplate rejects incompatible attachment and profile dimensions", () => {
  const { fn, ...props } = expected
  for (const invalid of [
    { columns: 4 },
    { rows: 3 },
    { columns: 2.5 },
    { holeDiameter: 25 },
  ])
    expect(() =>
      fixturePlateModelPropsSchema.parse({ ...props, ...invalid }),
    ).toThrow()
})
